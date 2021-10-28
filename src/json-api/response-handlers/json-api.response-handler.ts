import {
  Class,
  container,
  ResponseHandlerContext,
  ResponseHandlerInterface
} from '@triptyk/nfw-core';
import { UserSerializer } from '../../api/serializer/user.serializer.js';

export class JsonApiResponsehandler implements ResponseHandlerInterface {
  async handle (controllerResponse: unknown, context: ResponseHandlerContext): Promise<void> {
    const [serializer] = context.args as [Class<UserSerializer>];
    context.response.type = 'application/vnd.api+json';
    context.response.body = await container.resolve(serializer).serialize(controllerResponse);
  }
}
