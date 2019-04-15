"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const role_enum_1 = require("./../enums/role.enum");
// GET /v1/users
const listUsers = {
    query: {}
};
exports.listUsers = listUsers;
// GET /v1/users/userId
const getUser = {
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.getUser = getUser;
// POST /v1/users
const createUser = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(16).required(),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles),
    }
};
exports.createUser = createUser;
// PUT /v1/users/:userId
const replaceUser = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(16).required(),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles),
    },
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
    }
};
exports.replaceUser = replaceUser;
// PATCH /v1/users/:userId
const updateUser = {
    body: {
        email: Joi.string().email(),
        password: Joi.string().allow('').allow(null).min(8).max(16),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles),
    },
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
    }
};
exports.updateUser = updateUser;
