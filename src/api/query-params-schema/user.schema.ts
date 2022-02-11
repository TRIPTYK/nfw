import type { ControllerParamsContext } from '@triptyk/nfw-core';
import { injectable, singleton } from '@triptyk/nfw-core';
import type { CheckTypes, QueryParamsSchemaInterface } from '../../json-api/interfaces/query-params.interface.js';

@singleton()
@injectable()
export class UserQueryParamsSchema implements QueryParamsSchemaInterface {
  allowedIncludes (_context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['documents'];
  }

  allowedFields (_context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id', /users\.(.+)/, /documents\.(.+)/];
  }

  allowedSortFields (_context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['-id'];
  }

  allowedFilters (_context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id.$eq'];
  }
}
