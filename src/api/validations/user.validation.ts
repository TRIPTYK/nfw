// modifier le 24/09/19
import {Roles} from "../enums/role.enum";
import {Schema} from "express-validator";
import { UserRepository } from "../repositories/user.repository";
import { getCustomRepository } from "typeorm";

export const changePassword: Schema = {
    new_password: {
        exists: true
    },
    old_password: {
        exists: true
    }
};

// GET /v1/users/userId
export const getUser: Schema = {
    userId: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt : true
    }
};

// POST /v1/users
export const createUser: Schema = {
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

// PATCH /v1/users/:userId
export const updateUser: Schema = {
    email: {
        isEmail: true,
        optional: true
    },
    firstname: {
        isString : true,
        optional: true
    },
    lastname: {
        isString : true,
        isUppercase: {
            negated: true,
        },
        optional: true
    },
    password: {
        isString : true,
        optional: true
    },
    role: {
        isIn: {
            options: [Object.values(Roles)]
        },
        optional: true
    },
    userId: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt : true
    },
    username: {
        isString : true,
        optional: true,
    }
};
