import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Administrator } from '../../../entity/administrator/administrator.entity';
import { Shop } from '../../../entity/shop/shop.entity';
import { User } from '../../../entity/user/user.entity';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Administrator')
export class AdministratorEntityResolver {
    constructor(private connection: TransactionalConnection) {}

    @ResolveField()
    async user(@Ctx() ctx: RequestContext, @Parent() administrator: Administrator): Promise<User> {
        if (administrator.user) {
            return administrator.user;
        }
        const { user } = await this.connection.getEntityOrThrow(ctx, Administrator, administrator.id, {
            relations: {
                user: { roles: true },
            },
        });
        return user;
    }

    @ResolveField()
    async shop(@Ctx() ctx: RequestContext, @Parent() administrator: Administrator): Promise<Shop> {
        if (administrator.shop) {
            return administrator.shop;
        }
        const { shop } = await this.connection.getEntityOrThrow(ctx, Administrator, administrator.id, {
            relations: {
                shop: true,
            },
        });
        return shop;
    }
}
