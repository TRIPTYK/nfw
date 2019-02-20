"use strict";
exports.__esModule = true;
var Joi = require("joi");
// POST /v1/auth/register
var register = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(128)
    }
};
exports.register = register;
// POST /v1/auth/login
var login = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required().max(128)
    }
};
exports.login = login;
// POST /v1/auth/facebook
// POST /v1/auth/google
var oAuth = {
    body: {
        access_token: Joi.string().required()
    }
};
exports.oAuth = oAuth;
// POST /v1/auth/refresh
var refresh = {
    body: {
        token: Joi.object().keys({
            refreshToken: Joi.string().required()
        }).required()
    }
};
exports.refresh = refresh;
