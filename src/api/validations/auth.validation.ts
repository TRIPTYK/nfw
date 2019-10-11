import {Schema} from "express-validator";
import {getRepository, getCustomRepository} from "typeorm";
import {User} from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

// POST /v1/auth/register
const register: Schema = {
    email: {
        custom: {
            options: async (value) => {
                if (await (getCustomRepository(UserRepository).exists("email", value))) {
                    return Promise.reject("email already exists");
                }
            }
        },
        isEmail: true
    },
    firstname: {
        isString : true,
        isUppercase: {
            negated: true,
        }
    },
    lastname: {
        isString : true,
        isUppercase: {
            negated: true,
        }
    },
    password: {
        isEmpty : {
            negated : true
        },
        isString : true,
    },
    username: {
        custom: {
            options: async (value) => {
                if (await (getCustomRepository(UserRepository).exists("username", value))) {
                    return Promise.reject("username already exists");
                }
            }
        },
        isString : true,
        isUppercase: {
            negated: true,
        }
    }
};

// POST /v1/auth/login
const login: Schema = {
    email: {
        isEmail: true
    },
    force : {
        in : ["query"],
        isBoolean : true,
        optional : true,
        toBoolean : true
    },
    password: {
        isEmpty : {
            errorMessage : "Password must not be empty",
            negated : true
        },
        isString : true
    }
};

// POST /v1/auth/refresh
const refresh: Schema = {
    token: {
        exists : true,
        isString : true
    }
};

export {register, login, refresh};
