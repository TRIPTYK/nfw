import { Class, container, createCustomDecorator } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import { ControllerParamsContext } from '@triptyk/nfw-core/dist/storages/metadata/use-params.metadata';
import { parseFields, parseIncludes, parseSort } from '../parser/parse-includes.js';
import { Field, Nested, Number, Schema, SchemaBase, String, validateOrReject } from 'fastest-validator-decorators';
// @ts-expect-error
import dot from 'node-dotify'
import { QueryParamsSchemaInterface } from '../interfaces/query-params.interface.js';

@Schema(true)
class ValidatedJsonApiQueryParamsPagination extends SchemaBase {
  @Number()
  declare number: number;

  @Number()
  declare size: number;
}

@Schema()
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
      rules: [
        { type: 'object' },
        { type: 'string' },
      ],
    })
    public fields?: string[];

    @Nested({
      optional: true,
    })
    public filters?: any;
}

const doesMatch = (array:string[], allowed: (string | RegExp)[]) => {
  if (array.length === 0) return true;
  return array.some((include) => allowed.some((allowedInclude) => {
    return typeof allowedInclude === 'string' ? allowedInclude === include : allowedInclude.test(include);
  }));
}

export function JsonApiQueryParams (paramsSchema: Class<QueryParamsSchemaInterface>) {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    const schemaInstance = container.resolve(paramsSchema);
    try {
      const params = new ValidatedJsonApiQueryParams(context.ctx.query);
      await validateOrReject(params);

      params.fields = parseFields(params.fields as any);
      params.sort = parseSort(params.sort as any);
      params.include = parseIncludes(params.include as any);

      const [allowedFields, allowedIncludes, allowedSortFields, allowedFilters] = await Promise.all([schemaInstance.allowedFields(context), schemaInstance.allowedIncludes(context), schemaInstance.allowedSortFields(context), schemaInstance.allowedFilters(context)]);

      /**
       * If one include does not match
       */
      if (!doesMatch(params.include, allowedIncludes)) {
        throw createHttpError(400, `Cannot include ${params.include}`);
      }

      if (!doesMatch(params.sort, allowedSortFields)) {
        throw createHttpError(400, `Cannot sort on ${params.sort}`);
      }

      if (!doesMatch(params.fields, allowedFields)) {
        throw createHttpError(400, `Cannot fields ${params.fields}`);
      }

      const matchableFilters = dot(params.filters);

      if (!doesMatch(Object.keys(matchableFilters), allowedFilters)) {
        throw createHttpError(400, `Cannot filters ${params.filters}`);
      }

      return params;
    } catch (error: any) {
      throw createHttpError(400, error);
    }
  }, 'json-api-params');
}
