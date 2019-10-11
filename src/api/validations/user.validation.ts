// modifier le 24/09/19
import {roles} from "../enums/role.enum";
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
        isString : true,
        /*
        matches: {
            options: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/,
            errorMessage: "Password must have at least 8 characters,1 uppercase,1 lowercase and 1 special"
        }*/
    },
    role: {
        isIn: {
            options: [roles]
        }
    },
    username: {
        custom: {
            options: async (value) => {
                if (await (getCustomRepository(UserRepository).exists("username", value))) {
                    return Promise.reject("Username already exists");
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
            options: [roles]
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
