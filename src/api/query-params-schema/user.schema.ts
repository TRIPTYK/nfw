import { ControllerParamsContext, injectable, singleton } from '@triptyk/nfw-core';
import { CheckTypes, QueryParamsSchemaInterface } from '../../json-api/interfaces/query-params.interface.js';

@singleton()
@injectable()
export class UserQueryParamsSchema implements QueryParamsSchemaInterface {
  allowedIncludes (context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['refreshToken', /^articles(\.\w+)?$/];
  }

  allowedFields (context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id'];
  }

  allowedSortFields (context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return [];
  }

  allowedFilters (context: ControllerParamsContext): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id.$eq'];
  }
}
