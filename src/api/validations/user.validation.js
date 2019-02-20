"use strict";
exports.__esModule = true;
var Joi = require("joi");
var role_enum_1 = require("./../enums/role.enum");
// GET /v1/users
var listUsers = {
    query: {
        page: Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
        username: Joi.string(),
        email: Joi.string(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        role: Joi.string().valid(role_enum_1.roles)
    }
};
exports.listUsers = listUsers;
// GET /v1/users/userId
var getUser = {
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.getUser = getUser;
// POST /v1/users
var createUser = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(16).required(),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles)
    }
};
exports.createUser = createUser;
// PUT /v1/users/:userId
var replaceUser = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(16).required(),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles)
    },
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.replaceUser = replaceUser;
// PATCH /v1/users/:userId
var updateUser = {
    body: {
        email: Joi.string().email(),
        password: Joi.string().min(8).max(16),
        username: Joi.string().max(32),
        lastname: Joi.string().max(32),
        firstname: Joi.string().max(32),
        role: Joi.string().valid(role_enum_1.roles)
    },
    params: {
        userId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.updateUser = updateUser;
