import type { ControllerParamsContext } from '@triptyk/nfw-core';

export type CheckTypes = string | RegExp;

export interface QueryParamsSchemaInterface {
  allowedIncludes(context: ControllerParamsContext): Promise<CheckTypes[]> | CheckTypes[],
  allowedFields(context: ControllerParamsContext): Promise<CheckTypes[]> | CheckTypes[],
  allowedSortFields(context: ControllerParamsContext): Promise<CheckTypes[]> | CheckTypes[],
  allowedFilters(context: ControllerParamsContext): Promise<CheckTypes[]> | CheckTypes[],
}
