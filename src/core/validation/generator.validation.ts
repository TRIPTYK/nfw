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
        isInt: true,
        custom : {
            options: (value,{req}) => {
                if (req.body.type.contains("int")) {
                    return "must use width with number type";
                }else{
                    if (req.body.width) {
                        return "length and width are exclusive";
                    }
                }
            }
        }
    },
    "columns.*.width": {
        isInt: true,
        custom : {
            options: (value,{req}) => {
                if (!req.body.type.contains("int")) {
                    return "must use width with number type";
                }else{
                    if (req.body.length) {
                        return "length and width are exclusive";
                    }
                }
            }
        }
    },
    "columns.*.isPrimary": {
        isBoolean: true
    },
    "columns.*.isUnique": {
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
