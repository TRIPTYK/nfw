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
