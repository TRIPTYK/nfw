import { Class, container, createCustomDecorator } from '@triptyk/nfw-core';
import Joi from 'joi';
import createHttpError from 'http-errors';
import { ControllerParamsContext } from '@triptyk/nfw-core/dist/storages/metadata/use-params.metadata';
import { parseFields, parseIncludes, parseSort } from '../parser/parse-includes.js';
import { QueryParamsSchemaInterface } from '../../api/query-params-schema/user.schema.js';

const validationSchema = Joi.object({
  include: Joi.string(),
  sort: Joi.string(),
  fields: [Joi.string().alphanum(), Joi.object()],
  filters: [Joi.string().alphanum(), Joi.object()]
})

export function JsonApiQueryParams (paramsSchema: Class<QueryParamsSchemaInterface>) {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    const schemaInstance = container.resolve(paramsSchema);
    try {
      const { fields, sort, include } = await validationSchema.validateAsync(context.ctx.query);
      const parsed = { fields: parseFields(fields), sort: parseSort(sort), include: parseIncludes(include) };

      const [allowedFields, allowedIncludes, allowedSortFields] = await Promise.all([schemaInstance.allowedFields(context), schemaInstance.allowedIncludes(context), schemaInstance.allowedSortFields(context)]);

      /**
       * If one include does not match
       */
      if (parsed.include.some((include) => !allowedIncludes.includes(include))) {
        throw createHttpError(400, `Cannot include ${parsed.include}`);
      }

      return parsed;
    } catch (error: any) {
      throw createHttpError(400, error);
    }
  });
}
