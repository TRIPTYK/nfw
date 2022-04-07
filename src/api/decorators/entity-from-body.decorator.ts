import type { AnyEntity, EntityDTO, MikroORM } from '@mikro-orm/core';
import { ReferenceType, wrap } from '@mikro-orm/core';
import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';

export function EntityFromBody<T extends SchemaBase, K extends AnyEntity<K>> (ValidationClass : Class<T>, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const context = databaseConnection.em.getContext();
      const relationsOfEntity = databaseConnection.em.getMetadata().find(EntityModel.name)?.relations;

      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        throw isChecked;
      }

      for (const [entityKey, entityValue] of Object.entries(validatedBody)) {
        const relationMeta = relationsOfEntity?.find((relation) => entityKey.includes(relation.name));
        if (relationMeta) {
          const inverseRepository = context.getRepository(relationMeta.type);
          if (relationMeta?.reference === ReferenceType.ONE_TO_MANY || relationMeta?.reference === ReferenceType.MANY_TO_MANY) {
            (validatedBody as any)[entityKey] = await Promise.all(((entityValue as string[]).map(e => (inverseRepository as any).findOneOrFail({ id: e }))));
          } else {
            if (entityValue !== null) {
              (validatedBody as any)[entityKey] = await (inverseRepository.findOneOrFail as any)({ id: entityValue });
            }
          }
        }
      }

      const newEntity = new EntityModel();
      wrap(newEntity).assign(validatedBody as unknown as Partial<EntityDTO<K>>, { em: databaseConnection.em });
      return newEntity;
    }, 'entity-from-body');
}
