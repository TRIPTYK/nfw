import {getCustomRepository} from "typeorm";
import { UserRepository } from "../repositories/user.repository";
import { ValidationSchema } from "../../core/types/validation";
import { User } from "../models/user.model";

// POST /v1/auth/register
const register: ValidationSchema<User> = {
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
    first_name: {
        isString : true
    },
    last_name: {
        isString : true
    },
    password: {
        isEmpty : {
            negated : true
        },
        isString : true
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
const login: ValidationSchema<User> = {
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
const refresh: ValidationSchema<any> = {
    refreshToken : {
        exists : true,
        isString : true
    }
};

export {register, login, refresh };
