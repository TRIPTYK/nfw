import {
  ControllerParamsContext,
  injectable,
  singleton,
} from '@triptyk/nfw-core';
import { QueryParamsSchemaInterface } from './user.schema';

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
}
