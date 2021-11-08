import { MikroORM } from '@mikro-orm/core';
import { Class, container, ControllerParamsContext, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'
import { SchemaBase } from 'fastest-validator-decorators'
import createHttpErrors from 'http-errors';
import { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { AclService } from '../services/acl.service.js';

export function EntityFromBody<T extends SchemaBase> (ValidationClass : Class<T>, entityModel: Class<JsonApiModelInterface>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const connexion = container.resolve<MikroORM>(databaseInjectionToken);
      const aclService = container.resolve<AclService>(AclService);
      const repo = connexion.em.getContext().getRepository(entityModel);
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        const messages = isChecked.map(error => error.message);
        throw createHttpErrors(400, JSON.stringify(messages));
      }
      const entity = repo.create(validatedBody);
      await aclService.enforce((entity.constructor as any).ability, controllerContext.ctx.state.user, controllerContext.controllerAction as any, entity);
      return entity;
    },
  )
}
