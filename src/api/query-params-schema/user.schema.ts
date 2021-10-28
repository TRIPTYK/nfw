import { ControllerParamsContext, injectable, singleton } from '@triptyk/nfw-core';

export interface QueryParamsSchemaInterface {
    allowedIncludes(context: ControllerParamsContext): Promise<string[]> | string[],
    allowedFields(context: ControllerParamsContext): Promise<string[]> | string[],
    allowedSortFields(context: ControllerParamsContext): Promise<string[]> | string[],
}

@singleton()
@injectable()
export class UserQueryParamsSchema implements QueryParamsSchemaInterface {
  allowedIncludes (context: ControllerParamsContext): string[] | Promise<string[]> {
    return ['refreshToken', 'articles'];
  }

  allowedFields (context: ControllerParamsContext): string[] | Promise<string[]> {
    return [];
  }

  allowedSortFields (context: ControllerParamsContext): string[] | Promise<string[]> {
    return [];
  }
}
