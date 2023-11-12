import * as yup from 'yup';

export const validatedJsonApiQueryPaginationSchema = yup.object().shape({
  number: yup.number().min(1).required(),
  size: yup.number().min(1).max(20).required()
});

export const validatedJsonApiQuerySchema = yup.object().shape({
  include: yup.array().of(yup.string()).optional(),
  sort: yup.array().of(yup.string()).optional(),
  page: validatedJsonApiQueryPaginationSchema.optional(),
  fields: yup.mixed().oneOf([yup.object(), yup.string(), yup.array()]).optional(),
  filter: yup.object().optional()
});
