import {Schema} from "express-validator";
import {getCustomRepository} from "typeorm";
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
        isString : true
    },
    lastname: {
        isString : true
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
        isString : true
    }
};

// POST /v1/auth/login
const login: Schema = {
    email: {
        isEmail: true
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
    refreshToken : {
        exists : true,
        isString : true
    }
};

export {register, login, refresh };
