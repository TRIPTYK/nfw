/*
    Global validation elements like ids , ...
 */

import {Schema} from "express-validator";

export const relationships: Schema = {
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'wrong id format'
    },
    relation: {
        in: ['params'],
        isString: true,
        errorMessage: 'wrong relationship format'
    }
};