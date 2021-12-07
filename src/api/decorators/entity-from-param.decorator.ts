import { SqlEntityRepository } from '.pnpm/@mikro-orm+knex@4.5.9_357d0c55e72fe1e68b8c6f7ea14d2277/node_modules/@mikro-orm/knex';
import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { Class, container, ControllerParamsContext, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'

export function EntityFromParam<K extends BaseEntity<any, any>> (param: keyof K, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const context = databaseConnection.em.getContext();
      return (context.getRepository(EntityModel) as SqlEntityRepository<K>).findOneOrFail({ [param]: (controllerContext.ctx.params as Record<any, unknown>)[param] });
    }, 'entity-from-param');
}
