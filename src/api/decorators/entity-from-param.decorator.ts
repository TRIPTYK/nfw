import type { AnyEntity, MikroORM } from '@mikro-orm/core';
import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core';

export function EntityFromParam<K extends AnyEntity<K>> (param: keyof K, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const context = databaseConnection.em.getContext();
      const repository = context.getRepository(EntityModel);

      return repository.findOneOrFail({ [param]: (controllerContext.ctx.params as Record<keyof K, unknown>)[param] });
    }, 'entity-from-param');
}
