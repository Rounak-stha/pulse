import { Injectable } from '@nestjs/common';
import { MutationRegisterShopArgs, RegisterShopResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Request, Response } from 'express';

import { setSessionToken } from '../../api';
import { ApiType } from '../../api/common/get-api-type';
import { RequestContext } from '../../api/common/request-context';
import { RegisterShopIntemediateResult } from '../../common';
import { InternalServerError } from '../../common/error/errors';
import { InvalidCredentialsError } from '../../common/error/generated-graphql-admin-errors';
import {
    EmailAddressConflictError,
    ErrorResult,
    NotVerifiedError,
    ShopCodeConflictError,
    InvalidCredentialsError as ShopInvalidCredentialsError,
} from '../../common/error/generated-graphql-shop-errors';
import { Instrument } from '../../common/instrument-decorator';
import { AuthenticationStrategy } from '../../config/auth/authentication-strategy';
import {
    NATIVE_AUTH_STRATEGY_NAME,
    NativeAuthenticationData,
    NativeAuthenticationStrategy,
} from '../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ExternalAuthenticationMethod } from '../../entity/authentication-method/external-authentication-method.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { AttemptedLoginEvent } from '../../event-bus/events/attempted-login-event';
import { LoginEvent } from '../../event-bus/events/login-event';
import { LogoutEvent } from '../../event-bus/events/logout-event';
import { getUserChannelsPermissions } from '../helpers/utils/get-user-channels-permissions';

import { AdministratorService } from './administrator.service';
import { ChannelService } from './channel.service';
import { SessionService } from './session.service';
import { ShopService } from './shop.service';

/**
 * @description
 * Contains methods relating to {@link Session}, {@link AuthenticatedSession} & {@link AnonymousSession} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class AuthService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private shopService: ShopService,
        private sessionService: SessionService,
        private administratorService: AdministratorService,
        private channelService: ChannelService,
        private eventBus: EventBus,
    ) {}

    /**
     * @description
     * Authenticates a user's credentials and if okay, creates a new {@link AuthenticatedSession}.
     */
    async authenticate(
        ctx: RequestContext,
        apiType: ApiType,
        authenticationMethod: string,
        authenticationData: any,
    ): Promise<AuthenticatedSession | InvalidCredentialsError | NotVerifiedError> {
        await this.eventBus.publish(
            new AttemptedLoginEvent(
                ctx,
                authenticationMethod,
                authenticationMethod === NATIVE_AUTH_STRATEGY_NAME
                    ? (authenticationData as NativeAuthenticationData).username
                    : undefined,
            ),
        );
        const authenticationStrategy = this.getAuthenticationStrategy(apiType, authenticationMethod);
        const authenticateResult = await authenticationStrategy.authenticate(ctx, authenticationData);
        if (typeof authenticateResult === 'string') {
            return new InvalidCredentialsError({ authenticationError: authenticateResult });
        }
        if (!authenticateResult) {
            return new InvalidCredentialsError({ authenticationError: '' });
        }

        if (ctx.apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(
                ctx,
                authenticateResult.id,
                ['shop'],
            );
            if (!administrator) {
                return new InvalidCredentialsError({ authenticationError: '' });
            }
            const shop = administrator.shop;
            const channel = await this.channelService.getDefaultChannel(shop);
            ctx = ctx.withShopAndChannel(ctx.shop, channel);
        }
        return this.createAuthenticatedSessionForUser(ctx, authenticateResult, authenticationStrategy.name);
    }

    async createAuthenticatedSessionForUser(
        ctx: RequestContext,
        user: User,
        authenticationStrategyName: string,
    ): Promise<AuthenticatedSession | NotVerifiedError> {
        if (!user.roles || !user.roles[0]?.channels) {
            const userWithRoles = await this.connection
                .getRepository(ctx, User)
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'role')
                .leftJoinAndSelect('role.channels', 'channel')
                .where('user.id = :userId', { userId: user.id })
                .getOne();
            user.roles = userWithRoles?.roles || [];
        }

        const extAuths = (user.authenticationMethods ?? []).filter(
            am => am instanceof ExternalAuthenticationMethod,
        );
        if (!extAuths.length && this.configService.authOptions.requireVerification && !user.verified) {
            return new NotVerifiedError();
        }
        if (ctx.session && ctx.session.activeOrderId) {
            await this.sessionService.deleteSessionsByActiveOrderId(ctx, ctx.session.activeOrderId);
        }
        user.lastLogin = new Date();
        await this.connection.getRepository(ctx, User).save(user, { reload: false });
        const session = await this.sessionService.createNewAuthenticatedSession(
            ctx,
            ctx.shop,
            user,
            authenticationStrategyName,
        );
        await this.eventBus.publish(new LoginEvent(ctx, user));
        return session;
    }

    /**
     * @description
     * Verify the provided password against the one we have for the given user. Requires
     * the {@link NativeAuthenticationStrategy} to be configured.
     */
    async verifyUserPassword(
        ctx: RequestContext,
        userId: ID,
        password: string,
    ): Promise<boolean | InvalidCredentialsError | ShopInvalidCredentialsError> {
        const nativeAuthenticationStrategy = this.getAuthenticationStrategy(
            'shop',
            NATIVE_AUTH_STRATEGY_NAME,
        );
        const passwordMatches = await nativeAuthenticationStrategy.verifyUserPassword(ctx, userId, password);
        if (!passwordMatches) {
            return new InvalidCredentialsError({ authenticationError: '' });
        }
        return true;
    }

    /**
     * @description
     * Creates a new {@link Shop} and {@link Administrator}.
     */
    async createShopAnAdminUser(
        ctx: RequestContext,
        args: MutationRegisterShopArgs,
    ): Promise<RegisterShopIntemediateResult> {
        const existingShop = await this.shopService.findByCode(ctx, args.input.shop.code);
        const existingAdministratir = await this.administratorService.findOneByEmail(
            ctx,
            args.input.administrator.email,
        );

        if (existingShop) {
            return new ShopCodeConflictError();
        }

        if (existingAdministratir) {
            return new EmailAddressConflictError();
        }

        ctx = await this.shopService.registerShop(ctx, args.input.shop);
        const administrator = await this.administratorService.registerAdministrator(
            ctx,
            args.input.administrator,
        );

        return {
            shop: ctx.shop,
            administrator,
        };
    }

    /**
     * @description
     * Creates a new {@link Shop} and {@link Administrator}. and sets Session
     */
    async registerShopAndAdminUser(
        args: MutationRegisterShopArgs,
        ctx: RequestContext,
        req: Request,
        res: Response,
    ): Promise<RegisterShopResult> {
        const registerShopResult = await this.createShopAnAdminUser(ctx, args);

        if (registerShopResult instanceof ErrorResult) {
            return registerShopResult as RegisterShopResult;
        }

        const { shop, administrator } = registerShopResult;

        ctx = ctx.withShopAndChannel(shop, shop.channels[0]);

        const session = await this.createAuthenticatedSessionForUser(
            ctx,
            administrator.user,
            NativeAuthenticationStrategy.name,
        );

        // Administrators are verified by default
        if (session instanceof NotVerifiedError) {
            throw new InternalServerError('An Error Occured');
        }

        setSessionToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: true,
            sessionToken: session.token,
        });

        return {
            shop,
            currentUser: {
                id: administrator.user.id,
                identifier: administrator.user.identifier,
                channels: getUserChannelsPermissions(administrator.user),
            },
        };
    }

    /**
     * @description
     * Deletes all sessions for the user associated with the given session token.
     */
    async destroyAuthenticatedSession(ctx: RequestContext, sessionToken: string): Promise<void> {
        const session = await this.connection.getRepository(ctx, AuthenticatedSession).findOne({
            where: { token: sessionToken },
            relations: ['user', 'user.authenticationMethods'],
        });

        if (session) {
            const authenticationStrategy = this.getAuthenticationStrategy(
                ctx.apiType,
                session.authenticationStrategy,
            );
            if (typeof authenticationStrategy.onLogOut === 'function') {
                await authenticationStrategy.onLogOut(ctx, session.user);
            }
            await this.eventBus.publish(new LogoutEvent(ctx));
            return this.sessionService.deleteSessionsByUser(ctx, session.user);
        }
    }

    private getAuthenticationStrategy(
        apiType: ApiType,
        method: typeof NATIVE_AUTH_STRATEGY_NAME,
    ): NativeAuthenticationStrategy;
    private getAuthenticationStrategy(apiType: ApiType, method: string): AuthenticationStrategy;
    private getAuthenticationStrategy(apiType: ApiType, method: string): AuthenticationStrategy {
        const { authOptions } = this.configService;
        const strategies =
            apiType === 'admin'
                ? authOptions.adminAuthenticationStrategy
                : authOptions.shopAuthenticationStrategy;
        const match = strategies.find(s => s.name === method);
        if (!match) {
            throw new InternalServerError('error.unrecognized-authentication-strategy', { name: method });
        }
        return match;
    }
}
