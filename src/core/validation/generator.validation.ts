import { ValidationSchema } from "../types/validation";

export const createEntity: ValidationSchema<any> = {
    "columns.*.name": {
        exists: true,
        isString: true
    },
    "columns.*.type": {
        exists: true,
        isString: true
    },
    "columns.*.default": {
        exists: true
    },
    "columns.*.length": {
        exists: true,
        isInt: true
    },
    "columns.*.isPrimary": {
        exists: true,
        isBoolean: true
    },
    "columns.*.isUnique": {
        exists: true,
        isBoolean: true
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true
    }
};

export const createColumn: ValidationSchema<any> = {
    name: {
        exists: true,
        isString: true
    },
    type: {
        exists: true,
        isString: true
    },
    default: {
        exists: true
    },
    length: {
        exists: true,
        isInt: true
    },
    isPrimary: {
        exists: true,
        isBoolean: true
    },
    isUnique: {
        exists: true,
        isBoolean: true
    },
    isNullable: {
        exists: true,
        isBoolean: true
    }
}
