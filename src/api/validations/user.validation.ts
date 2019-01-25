import * as Joi from "joi";
import { roles } from "./../enums/role.enum";

// GET /v1/users
const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    username: Joi.string(),
    email: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    role: Joi.string().valid(roles),
  }
};

// GET /v1/users/userId
const getUser = {
  params: {
    userId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
};

// POST /v1/users
const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(roles),
  }
};

// PUT /v1/users/:userId
const replaceUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(roles),
  },
  params: {
    userId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

// PATCH /v1/users/:userId
const updateUser = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(8).max(16),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(roles),
  },
  params: {
    userId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

export { listUsers, getUser, createUser, replaceUser, updateUser };