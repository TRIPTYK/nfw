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

const changePassword: Schema = {
    old_password: {
        exists: true
    },
    new_password: {
        exists: true
    }
};

// GET /v1/users/userId
const getUser: Schema = {
    userId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    }
};

// POST /v1/users
const createUser: Schema = {
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
    },
    role: {
        isIn: {
            options: [roles]
        }
    }
};

// PATCH /v1/users/:userId
const updateUser: any = {
    userId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    },
    email: {
        optional: {
            options: {
                nullable: true
            }
        },
        isEmail: true
    },
    password: {
        optional: {
            options: {
                nullable: true
            }
        }
    },
    username: {
        optional: {
            options: {
                nullable: true
            }
        },
    },
    lastname: {
        optional: {
            options: {
                nullable: true
            }
        },
        isUppercase: {
            negated: true,
        }
    },
    firstname: {
        optional: {
            options: {
                nullable: true
            }
        }
    },
    role: {
        optional: true,
        isIn: {
            options: [roles]
        }
    }
};

export {getUser, createUser, updateUser, changePassword};
