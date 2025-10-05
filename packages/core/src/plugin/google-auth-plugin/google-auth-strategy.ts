
import { OAuth2Client } from 'google-auth-library';
import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';

import { AuthenticationStrategy, Logger } from '../../config';
import { ExternalAuthenticationService } from '../../service';
import { RequestContext } from '../../api/common/request-context'
import { Injector } from '../../common'
import { User } from '../../entity'

export type GoogleAuthData = {
    token: string;
    shopname?: string;
    shopcode?: string;
}

export interface GoogleAuthOptions {
    googleClientId: string;
    googleClientSecret: string;
    onUserCreated?: (ctx: RequestContext, injector: Injector, user: User) => void;
    onUserFound?: (ctx: RequestContext, injector: Injector, user: User) => void;
}

export class GoogleAuthStrategy implements AuthenticationStrategy<GoogleAuthData> {
    readonly name = 'google';
    private client: OAuth2Client;
    private externalAuthenticationService: ExternalAuthenticationService;
    private logger: Logger;
    private injector: Injector;

    constructor(private options: GoogleAuthOptions) {
        this.client = new OAuth2Client(options.googleClientId, options.googleClientSecret, 'postmessage');
        this.logger = new Logger();

    }

    init(injector: Injector) {
        this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
        this.injector = injector;
    }

    defineInputType(): DocumentNode {
        return gql`
            input GoogleAuthInput {
                token: String!
                shopname: String
                shopcode: String
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: GoogleAuthData): Promise<User | false> {
        try {
        // Step 1: Exchange Code for Token
        const { tokens } = await this.client.getToken(data.token);
        const idToken = tokens.id_token;

        if (!idToken) {
            this.logger.error('Invalid Google token', 'GoogleAuthStrategy');
            return false;
        }

        // Step 2: Verify the Google ID token
        const ticket = await this.client.verifyIdToken({
            idToken: idToken,
            audience: this.options.googleClientId,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            this.logger.error('Invalid Google token or missing email', 'GoogleAuthStrategy');
            return false;
        }

        // Step 3: Check if this Google user already has a Vendure account
        const existingAdministrator = await this.externalAuthenticationService.findAdministratorUser(
            ctx,
            this.name,
            payload.sub, // Google's unique user ID
        );

        if (existingAdministrator) {
            // User exists, log them in
            this.options.onUserFound?.(ctx, this.injector, existingAdministrator);
            return existingAdministrator;
        }

        // Step 4: Create a new customer account for first-time Google users
        /**
         * If we're at this step, than it means that a new Shop is being registered
         * So if the shop data is not passed, then we must throw an error
         */
        if (!data.shopname || !data.shopcode) {
            return false;
        }

        const createdUser = await this.externalAuthenticationService.createShopAndAdministratorAndUser(ctx, {
            strategy: this.name,
            externalIdentifier: payload.sub, // Store Google user ID
            emailAddress: payload.email,
            firstName: payload.given_name || 'Google',
            lastName: payload.family_name || 'User',
            shopName: data.shopname,
            shopCode: data.shopcode,
        });

        this.options.onUserCreated?.(ctx, this.injector, createdUser);

        return createdUser;
        } catch (error) {
            this.logger.error(`Google authentication failed: ${(error as Error).message}`, 'GoogleAuthStrategy');
            return false;
        }
    }
}