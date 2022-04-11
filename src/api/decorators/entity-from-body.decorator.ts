import type { AnyEntity, MikroORM } from '@mikro-orm/core';
import { ReferenceType } from '@mikro-orm/core';
import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';

export function EntityFromBody<T extends SchemaBase, K extends AnyEntity<K>> (ValidationClass : Class<T>, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      const relationsOfEntity = databaseConnection.em.getMetadata().find(EntityModel.name)?.relations;

      if (isChecked !== true) {
        throw isChecked;
      }

      for (const [entityKey, entityValue] of Object.entries(validatedBody)) {
        const relationMeta = relationsOfEntity?.find((relation) => entityKey.includes(relation.name));
        if (relationMeta) {
          const inverseRepository = databaseConnection.em.getRepository(relationMeta.type);
          if (relationMeta?.reference === ReferenceType.ONE_TO_MANY || relationMeta?.reference === ReferenceType.MANY_TO_MANY) {
            (validatedBody as any)[entityKey] = await Promise.all(((entityValue as string[]).map(e => inverseRepository.findOneOrFail({ id: e }))));
          } else {
            if (entityValue !== null) {
              (validatedBody as any)[entityKey] = await inverseRepository.findOneOrFail({ id: entityValue });
            }
          }
        }
      }

      return validatedBody;
    }, 'entity-from-body');
}
