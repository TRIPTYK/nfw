import { ValidationSchema } from "../types/validation";
import { Schema } from "express-validator";

const isObject = (element: any): boolean => typeof element === "object";
const isObjectOrString = (element: any): boolean => typeof element === "object" || typeof element === "string";

export const jsonApiQuery: Schema = {
    page: {
        in: ["query"],
        errorMessage: "Must be an object",
        optional : true,
        custom: {
            options : isObject
        }
    },
    fields: {
        in: ["query"],
        optional : true,
        errorMessage: "Must be a string or object",
        custom: {
            options : isObjectOrString
        }
    },
    include: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional : true,
        isString : true
    },
    sort: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional : true,
        isString : true
    },
    filter: {
        in: ["query"],
        errorMessage: "Must be an object",
        optional : true,
        custom: {
            options : isObject
        }
    }
}

export const get: ValidationSchema<any> = {
    ...jsonApiQuery,
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt : true
    }
};

export const list: ValidationSchema<any> = {
    ...jsonApiQuery
};

export const create: ValidationSchema<any> = {

};

export const update: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt : true
    }
};

