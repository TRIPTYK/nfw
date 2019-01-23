import * as Joi from "joi";

// POST /v1/auth/register
const register = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(128),
  }
};

// POST /v1/auth/login
const login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required().max(128),
  }
};

// POST /v1/auth/facebook
// POST /v1/auth/google
const oAuth = {
  body: {
    access_token: Joi.string().required(),
  }
};

// POST /v1/auth/refresh
const refresh = {
  body: {
    email: Joi.string().email().required(),
    refreshToken: Joi.string().required(),
  }
};

export { register, login, oAuth, refresh };