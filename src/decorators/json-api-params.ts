import { createCustomDecorator } from '@triptyk/nfw-core';
import Joi from 'joi';
import createHttpError from 'http-errors';
import { ControllerParamsContext } from '@triptyk/nfw-core/dist/storages/metadata/use-params.metadata';
import { parseFields, parseIncludes, parseSort } from '../parser/parse-includes.js';

const validationSchema = Joi.object({
  include: Joi.string().alphanum(),
  sort: Joi.string().alphanum(),
  fields: [Joi.string().alphanum(), Joi.object()],
  filters: [Joi.string().alphanum(), Joi.object()]
})

export function JsonApiQueryParams () {
  return createCustomDecorator(async (context: ControllerParamsContext) => {
    try {
      const { fields, sort, include } = await validationSchema.validateAsync(context.ctx.query);

      return { fields: parseFields(fields), sort: parseSort(sort), include: parseIncludes(include) }
    } catch (error: any) {
      throw createHttpError(400, error);
    }
  });
}
