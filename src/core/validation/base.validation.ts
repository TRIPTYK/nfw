import { Schema } from "express-validator";
import { ValidationSchema } from "../types/validation";

const isObject = (element: any): boolean => typeof element === "object";
const isObjectOrString = (element: any): boolean =>
    typeof element === "object" || typeof element === "string";

export const jsonApiQuery: Schema = {
    "page.*": {
        in: ["query"],
        isInt: true,
        toInt: true
    },
    fields: {
        in: ["query"],
        optional: true,
        errorMessage: "Must be a string or object",
        custom: {
            options: isObjectOrString
        }
    },
    include: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional: true,
        isString: true
    },
    sort: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional: true,
        isString: true
    },
    filter: {
        in: ["query"],
        errorMessage: "Must be an object",
        optional: true,
        custom: {
            options: isObject
        }
    }
};

export const get: ValidationSchema<any> = {
    ...jsonApiQuery,
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

export const list: ValidationSchema<any> = {
    ...jsonApiQuery
};

export const create: ValidationSchema<any> = {};

export const remove: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        isString: true
    }
};

export const fetchRelated: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        in: ["params"],
        isString: true
    }
};

export const fetchRelationships: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        in: ["params"],
        isString: true
    }
};

export const addRelationships: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        in: ["params"],
        isString: true
    }
};

export const updateRelationships: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        in: ["params"],
        isString: true
    }
};

export const removeRelationships: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    },
    relation: {
        in: ["params"],
        isString: true
    }
};

export const update: ValidationSchema<any> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};
