"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
// POST /v1/auth/register
const register = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(128)
    }
};
exports.register = register;
// POST /v1/auth/login
const login = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().max(128),
    }
};
exports.login = login;
// POST /v1/auth/facebook
// POST /v1/auth/google
const oAuth = {
    body: {
        access_token: Joi.string().required(),
    }
};
exports.oAuth = oAuth;
// POST /v1/auth/refresh
const refresh = {
    body: {
        token: Joi.object().keys({
            refreshToken: Joi.string().required(),
        }).required()
    }
};
exports.refresh = refresh;
