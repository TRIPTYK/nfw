import {
  ControllerParamsContext,
  injectable,
  singleton,
} from '@triptyk/nfw-core';
import {
  CheckTypes,
  QueryParamsSchemaInterface,
} from '../../json-api/interfaces/query-params.interface';

@singleton()
@injectable()
export class DocumentQueryParamsSchema implements QueryParamsSchemaInterface {
  allowedIncludes (
    context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return ['users'];
  }

  allowedFields (
    context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return ['path', 'filename', 'originalName', 'size', 'id', 'mimetype'];
  }

  allowedSortFields (
    context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return [];
  }

  allowedFilters (
    context: ControllerParamsContext,
  ): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id.$eq'];
  }
}
