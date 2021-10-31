import { Class, container, createCustomDecorator } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import { ControllerParamsContext } from '@triptyk/nfw-core/dist/storages/metadata/use-params.metadata';
import { parseFields, parseIncludes, parseSort } from '../parser/parse-includes.js';
import { QueryParamsSchemaInterface } from '../../api/query-params-schema/user.schema.js';
import { Nested, Number, Schema, SchemaBase, String, validateOrReject } from 'fastest-validator-decorators';

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

    @Nested({
      optional: true,
    })
    public fields?: any;

    @Nested({
      optional: true,
    })
    public filters?: any;
}

export function JsonApiQueryParams (paramsSchema: Class<QueryParamsSchemaInterface>) {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    const schemaInstance = container.resolve(paramsSchema);
    try {
      console.log(context.ctx.query)
      const params = new ValidatedJsonApiQueryParams(context.ctx.query);
      await validateOrReject(params);

      params.fields = parseFields(params.fields as any);
      params.sort = parseSort(params.sort as any);
      params.include = parseIncludes(params.include as any);

      const [allowedFields, allowedIncludes, allowedSortFields] = await Promise.all([schemaInstance.allowedFields(context), schemaInstance.allowedIncludes(context), schemaInstance.allowedSortFields(context)]);

      /**
       * If one include does not match
       */
      if (params.include.some((include) => !allowedIncludes.includes(include))) {
        throw createHttpError(400, `Cannot include ${params.include}`);
      }

      return params;
    } catch (error: any) {
      throw createHttpError(400, error);
    }
  });
}
