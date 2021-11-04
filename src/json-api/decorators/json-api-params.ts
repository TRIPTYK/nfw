import { Class, container, createCustomDecorator } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import { ControllerParamsContext } from '@triptyk/nfw-core/dist/storages/metadata/use-params.metadata';
import { parseFields, parseIncludes, parseSort } from '../parser/parse-includes.js';
import { QueryParamsSchemaInterface } from '../../api/query-params-schema/user.schema.js';
import { Field, Nested, Number, Schema, SchemaBase, String, validateOrReject } from 'fastest-validator-decorators';

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

export function JsonApiQueryParams (paramsSchema: Class<QueryParamsSchemaInterface>) {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    const schemaInstance = container.resolve(paramsSchema);
    try {
      const params = new ValidatedJsonApiQueryParams(context.ctx.query);
      await validateOrReject(params);

      params.fields = parseFields(params.fields as any);
      params.sort = parseSort(params.sort as any);
      params.include = parseIncludes(params.include as any);

      const [, allowedIncludes, allowedSortFields] = await Promise.all([schemaInstance.allowedFields(context), schemaInstance.allowedIncludes(context), schemaInstance.allowedSortFields(context)]);

      // /**
      //  * If one include does not match
      //  */
      // if (params.include.some((include) => !allowedIncludes.includes(include))) {
      //   throw createHttpError(400, `Cannot include ${params.include}`);
      // }

      // if (params.sort.some((include) => !allowedSortFields.includes(include))) {
      //   throw createHttpError(400, `Cannot sort on ${params.sort}`);
      // }

      return params;
    } catch (error: any) {
      throw createHttpError(400, error);
    }
  });
}
