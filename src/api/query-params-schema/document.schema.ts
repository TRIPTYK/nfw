import type { ControllerParamsContext } from '@triptyk/nfw-core';
import {
  injectable,
  singleton,
} from '@triptyk/nfw-core';
import type {
  CheckTypes,
  QueryParamsSchemaInterface,
} from '../../json-api/interfaces/query-params.interface';

@singleton()
@injectable()
export class DocumentQueryParamsSchema implements QueryParamsSchemaInterface {
  allowedIncludes (
    _context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return ['users'];
  }

  allowedFields (
    _context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return ['path', 'filename', 'originalName', 'size', 'id', 'mimetype'];
  }

  allowedSortFields (
    _context: ControllerParamsContext,
  ): string[] | Promise<string[]> {
    return [];
  }

  allowedFilters (
    _context: ControllerParamsContext,
  ): CheckTypes[] | Promise<CheckTypes[]> {
    return ['id.$eq'];
  }
}
