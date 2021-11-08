import { SqlEntityRepository } from '.pnpm/@mikro-orm+knex@4.5.9_357d0c55e72fe1e68b8c6f7ea14d2277/node_modules/@mikro-orm/knex';
import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { Class, ControllerGuardContext, databaseInjectionToken, GuardInterface, inject, injectable } from '@triptyk/nfw-core';
import { EntityAbility } from '../../api/abilities/base.js';
import { AclService } from '../../api/services/acl.service.js';

@injectable()
export class GuardCreate implements GuardInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(AclService) private aclService: AclService, @inject(databaseInjectionToken) private mikroORM: MikroORM) {}

  async can (context: ControllerGuardContext): Promise<boolean> {
    const entity = context.args[0] as Class<BaseEntity<any, any>>;
    const entityMetadata = this.mikroORM.getMetadata().find(entity.name);
    const currentUser = context.ctx.state;

    try {
      await this.aclService.enforce((entity as any).ability, currentUser, 'create', {
        name: entity.name,
        body: context.ctx.body as Record<string, unknown>,
      });
    } catch (e) {
      return false;
    }

    if (!entityMetadata) {
      throw new Error(`Entity metadata not found for ${entity.name}`);
    }

    const bodyKey = Object.keys(context.ctx.request.body as Record<string, unknown>);

    const relationsInBody = entityMetadata.relations.filter((rel) => bodyKey.includes(rel.name)).map((relMeta) => {
      return {
        relMeta,
        value: context.ctx.request.body[relMeta.name],
      }
    });

    for (const { relMeta, value } of relationsInBody) {
    //   const relEntityMeta = this.mikroORM.getMetadata().find();
      const ability = (relMeta.entity() as any).ability as EntityAbility<any> | undefined;
      if (!ability) throw new Error(`Entity ability not found for ${relMeta.entity().constructor}`);
      const repo = this.mikroORM.em.getContext().getRepository(relMeta.entity()) as SqlEntityRepository<any>;

      try {
        if (Array.isArray(value)) {
          const fetched = await repo.find({
            id: {
              $in: value,
            },
          });

          if (fetched.length !== value.length) {
            throw new Error('Not found');
          }

          await Promise.all(fetched.map((e) => this.aclService.enforce(ability, context.ctx.state.currentUser, 'read', e)));
        } else {
          const fetched = await repo.findOneOrFail({
            id: value,
          });

          await this.aclService.enforce(ability, context.ctx.state.currentUser, 'read', fetched);
        }
      } catch (e) {
        return false;
      }
    }

    return true;
  }
}
