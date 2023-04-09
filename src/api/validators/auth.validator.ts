import * as yup from 'yup';

export const registeredUserBodySchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required()
});

export const refreshBodySchema = yup.object().shape({
  refreshToken: yup.string().required()
});

export const loginBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});
