import { MikroORM } from '@mikro-orm/core';
import { Class, container, ControllerParamsContext, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'
import { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js'
import { AclService } from '../services/acl.service.js';

export function EntityFromParam (param: string, model : Class<JsonApiModelInterface>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const connexion = container.resolve<MikroORM>(databaseInjectionToken);
      const aclService = container.resolve<AclService>(AclService);
      const repo = connexion.em.getContext().getRepository(model);
      const entity = await repo.findOneOrFail({
        id: controllerContext.ctx.params[param],
      });
      await aclService.enforce((model as any).ability, controllerContext.ctx.state.user, controllerContext.controllerAction as any, entity);
      return entity;
    },
  )
}
