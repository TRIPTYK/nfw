import type {
  Class,
  ControllerParamsContext,
} from '@triptyk/nfw-core';
import {
  container,
  createCustomDecorator,
} from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import {
  parseFields,
  parseIncludes,
  parseSort,
} from '../parser/parse-includes.js';
import {
  Field,
  Nested,
  Number,
  Schema,
  SchemaBase,
  String,
  validateOrReject,
} from 'fastest-validator-decorators';
// @ts-expect-error
import dot from 'node-dotify';
import type { QueryParamsSchemaInterface } from '../interfaces/query-params.interface.js';

@Schema(true)
class ValidatedJsonApiQueryParamsPagination extends SchemaBase {
  @Number({
    min: 1,
  })
  declare number: number;

  @Number({
    min: 1,
    max: 20,
  })
  declare size: number;
}

@Schema(true)
export class ValidatedJsonApiQueryParams extends SchemaBase {
  @String({
    optional: true,
  })
  public include?: string[];

  @String({
    optional: true,
  })
  public sort?: string[];

  @Nested({
    optional: true,
  })
  public page?: ValidatedJsonApiQueryParamsPagination;

  @Field({
    type: 'multi',
    optional: true,
    rules: [{ type: 'object' }, { type: 'string' }],
  })
  public fields?: string[];

  @Nested({
    optional: true,
  })
  public filter?: Record<string, unknown>;
}

const doesMatch = (array: string[], allowed: (string | RegExp)[]) => {
  if (array.length === 0) return true;
  return array.some((include) =>
    allowed.some((allowedInclude) => {
      return typeof allowedInclude === 'string'
        ? allowedInclude === include
        : allowedInclude.test(include);
    }),
  );
};

export function JsonApiQueryParams (
  paramsSchema?: Class<QueryParamsSchemaInterface>,
) {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    if (!paramsSchema) return;
    const schemaInstance = container.resolve(paramsSchema);
    const params = new ValidatedJsonApiQueryParams({});
    Object.assign(params, context.ctx.query);
    await validateOrReject(params);

    params.fields = parseFields(params.fields);
    params.sort = parseSort(params.sort as unknown as string);
    params.include = parseIncludes(params.include as unknown as string);

    const [
      allowedFields,
      allowedIncludes,
      allowedSortFields,
      allowedFilters,
    ] = await Promise.all([
      schemaInstance.allowedFields(context),
      schemaInstance.allowedIncludes(context),
      schemaInstance.allowedSortFields(context),
      schemaInstance.allowedFilters(context),
    ]);

    /**
       * If one include does not match
       */
    if (!doesMatch(params.include, allowedIncludes)) {
      throw createHttpError(400, `Cannot include ${params.include}`, {
        name: 'IncludeError',
      });
    }

    if (!doesMatch(params.sort, allowedSortFields)) {
      throw createHttpError(400, `Cannot sort on ${params.sort}`, {
        name: 'SortError',
      });
    }

    if (!doesMatch(params.fields, allowedFields)) {
      throw createHttpError(400, `Cannot fields ${params.fields}`, {
        name: 'FieldsError',
      });
    }

    const matchableFilters = dot(params.filter);

    if (!doesMatch(Object.keys(matchableFilters), allowedFilters)) {
      throw createHttpError(400, `Cannot filters ${params.filter}`, {
        name: 'FilterError',
      });
    }

    return params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, 'json-api-params', true);
}
