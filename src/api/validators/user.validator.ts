import { string, object } from 'yup';
import { Roles } from '../enums/roles.enum.js';

export const createUserValidationSchema = object().shape({
  firstName: string().required(),
  lastName: string().required(),
  email: string().required(),
  role: string().oneOf(Object.values(Roles)).default(Roles.USER)
}).noUnknown();

export const updateUserValidationSchema = object().shape({
  firstName: string().optional(),
  lastName: string().optional(),
  email: string().optional(),
  password: string().optional(),
  role: string().oneOf(Object.values(Roles)).optional()
}).noUnknown();
