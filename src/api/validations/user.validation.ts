// modifier le 24/09/19
import {roles} from "../enums/role.enum";
import {getRepository} from "typeorm";
import {User} from "../models/user.model";
import {Schema} from "express-validator";

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

export const changePassword: Schema = {
    old_password: {
        exists: true
    },
    new_password: {
        exists: true
    }
};

// GET /v1/users/userId
export const getUser: Schema = {
    userId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true,
        toInt : true
    }
};

// POST /v1/users
export const createUser: Schema = {
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
    },
    role: {
        isIn: {
            options: [roles]
        }
    }
};

// PATCH /v1/users/:userId
export const updateUser: Schema = {
    userId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true,
        toInt : true
    },
    email: {
        optional: true,
        isEmail: true
    },
    password: {
        isString : true,
        optional: true
    },
    username: {
        isString : true,
        optional: true,
    },
    lastname: {
        isString : true,
        optional: true,
        isUppercase: {
            negated: true,
        }
    },
    firstname: {
        isString : true,
        optional: true
    },
    role: {
        optional: true,
        isIn: {
            options: [roles]
        }
    }
};
