import {
  ResponseHandlerContext,
  ResponseHandlerInterface
} from '@triptyk/nfw-core';

export class JsonResponsehandler implements ResponseHandlerInterface {
  handle (controllerResponse: unknown, context: ResponseHandlerContext): void {
    context.response.type = 'json';
    context.response.body = controllerResponse;
  }
}
