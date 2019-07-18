import {Schema} from "express-validator";
import {getRepository} from "typeorm";
import {User} from "../models/user.model";
import * as Joi from "@hapi/joi";

const _isEmailDuplicated = async (email) => {
    const uRepo = getRepository(User);
    const user = await uRepo.findOne({email: email});
    if (user) {
        return Promise.reject('Email already exists');
    }
};

const _isUsernameDuplicated = async (username) => {
    const uRepo = getRepository(User);
    const user = await uRepo.findOne({username: username});
    if (user) {
        return Promise.reject('Username already exists');
    }
};


// POST /v1/auth/register
const register: Schema = {
    email: {
        isEmail: true,
        custom: {
            options: _isEmailDuplicated
        }
    },
    password: {
        /*
        matches: {
            options: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/,
            errorMessage: "Password must have at least 8 characters,1 uppercase,1 lowercase and 1 special"
        }*/
    },
    username: {
        isUppercase: {
            negated: true,
        },
        custom: {
            options: _isUsernameDuplicated
        }
    },
    lastname: {
        isUppercase: {
            negated: true,
        }
    },
    firstname: {
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
    password: {
        exists: true
    }
};

// POST /v1/auth/refresh
const refresh: Schema = {
    token: {
        isString : true
    }
};

export {register, login, refresh};