import * as yup from 'yup';
import { MimeTypes } from '../enums/mime-type.enum.js';

export const validatedDocumentSchema = yup.object().shape({
  id: yup.string().optional(),
  mimetype: yup.string().oneOf(Object.values(MimeTypes)).required(),
  filename: yup.string().required(),
  originalName: yup.string().required(),
  path: yup.string().required(),
  size: yup.number().required(),
  users: yup.array().of(yup.string().required()).required()
}).noUnknown();
