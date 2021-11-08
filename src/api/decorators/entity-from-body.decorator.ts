import { BaseEntity, MikroORM, ReferenceType, wrap } from '@mikro-orm/core';
import { Class, container, ControllerParamsContext, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'
import { SchemaBase } from 'fastest-validator-decorators';
import createHttpErrors from 'http-errors';

export function EntityFromBody<T extends SchemaBase, K extends BaseEntity<any, any>> (ValidationClass : Class<T>, EntityModel: Class<K>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
      const context = databaseConnection.em.getContext();
      const relationsOfEntity = databaseConnection.em.getMetadata().find(EntityModel.name)?.relations;

      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        const messages = isChecked.map(error => error.message);
        throw createHttpErrors(400, JSON.stringify(messages));
      }

      for (const [entityKey, entityValue] of Object.entries(validatedBody)) {
        const relationMeta = relationsOfEntity?.find((relation) => entityKey.includes(relation.name));
        if (relationMeta) {
          const inverseRepository = context.getRepository((relationMeta.entity() as any).name);
          if (relationMeta?.reference === ReferenceType.ONE_TO_MANY || relationMeta?.reference === ReferenceType.MANY_TO_MANY) {
            (validatedBody as any)[entityKey] = await Promise.all(((entityValue as string[]).map(e => (inverseRepository as any).findOneOrFail({ id: e }))));
          } else {
            (validatedBody as any)[entityKey] = (inverseRepository.findOneOrFail as any)({ id: entityValue });
          }
        }
      }

      const newEntity = new EntityModel();
      wrap(newEntity).assign(validatedBody);
      return newEntity;
    },
  )
}
