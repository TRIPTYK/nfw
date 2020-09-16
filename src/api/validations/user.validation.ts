import {Roles} from "../enums/role.enum";
import { UserRepository } from "../repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { ValidationSchema } from "../../core/types/validation";
import { User } from "../models/user.model";

export const changePassword: ValidationSchema<any> = {
    new_password: {
        exists: true
    },
    old_password: {
        exists: true
    }
};

// POST /v1/users
export const create: ValidationSchema<User> = {
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
        errorMessage: "Must have a password",
        exists: true,
        isString : true,
    },
    username: {
        isString : true,
        isUppercase: {
            negated: true,
        }
    }
};

// PATCH /v1/users/:id
export const update: ValidationSchema<User> = {
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
    id: {
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
