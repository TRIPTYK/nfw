import * as Joi from "joi";
import { User } from "./../models/user.model";

// GET /v1/users
const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string().valid(User.roles),
  },
};

// POST /v1/users
const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(User.roles),
  },
};

// PUT /v1/users/:userId
const replaceUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(User.roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
};

// PATCH /v1/users/:userId
const updateUser = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(8).max(16),
    username: Joi.string().max(32),
    lastname: Joi.string().max(32),
    firstname: Joi.string().max(32),
    role: Joi.string().valid(User.roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
};

export { listUsers, createUser, replaceUser, updateUser };