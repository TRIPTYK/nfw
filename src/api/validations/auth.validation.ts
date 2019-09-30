import {Schema} from "express-validator";
import {getRepository} from "typeorm";
import {User} from "../models/user.model";

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
        isString : true,
        /*
        matches: {
            options: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/,
            errorMessage: "Password must have at least 8 characters,1 uppercase,1 lowercase and 1 special"
        }*/
    },
    username: {
        isString : true,
        isUppercase: {
            negated: true,
        },
        custom: {
            options: _isUsernameDuplicated
        }
    },
    lastname: {
        isString : true,
        isUppercase: {
            negated: true,
        }
    },
    firstname: {
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
    password: {
        exists: true
    },
    force : {
        optional : true,
        in : ['query'],
        isBoolean : true,
        toBoolean : true
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