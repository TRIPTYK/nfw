import type { AnyEntity, EntityDTO, MikroORM } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';

export function EntityFromBody<T extends SchemaBase, K extends AnyEntity<K>> (ValidationClass : Class<T>, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();

      if (isChecked !== true) {
        throw isChecked;
      }

      const newEntity = new EntityModel();
      wrap(newEntity).assign(validatedBody as unknown as Partial<EntityDTO<K>>, { em: databaseConnection.em });
      return newEntity;
    }, 'entity-from-body');
}
