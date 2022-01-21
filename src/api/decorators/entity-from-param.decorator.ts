import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { SqlEntityRepository } from '@mikro-orm/mysql';
import { Class, container, ControllerParamsContext, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'

export function EntityFromParam<K extends BaseEntity<any, any>> (param: keyof K, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const context = databaseConnection.em.getContext();
      return (context.getRepository(EntityModel) as SqlEntityRepository<K>).findOneOrFail({ [param]: (controllerContext.ctx.params as Record<any, unknown>)[param] });
    }, 'entity-from-param');
}
