import { container } from "tsyringe";
import TypeORMService from "../services/typeorm.service";
import { ValidationSchema } from "../types/validation";

export const createEntity: ValidationSchema<any> = {
    "columns.*.name": {
        exists: true,
        isString: true
    },
    "columns.*.type": {
        exists: true,
        isString: true,
        custom:{
            options: (value) => {
                const suported = container.resolve(TypeORMService).connection.driver.supportedDataTypes;
                if (!Object.values(suported).includes(value)) {
                    throw new Error("unsupported value");
                }
                return true;
            }
        }
    },
    "columns.*.default": {
        exists: true
    },
    "columns.*.length": {
        optional:true,
        isInt: true,
    },
    "columns.*.width": {
        optional:true,
        isInt: true,
    },
    "columns.*.isPrimary": {
        optional:true,
        isBoolean: true
    },
    "columns.*.isUnique": {
        optional:true,
        isBoolean: true
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true
    },
    "relations.*.name": {
        exists: true,
        isString: true
    },
    "relations.*.target": {
        exists: true,
        isString: true
    },
    "relations.*.type": {
        exists: true,
        isIn : {
            options : [["many-to-many","one-to-many","one-to-one"]]
        }
    },
    "relations.*.inverseRelationName": {
        optional: true,
        isString: true
    }
};

export const createRelation: ValidationSchema<any> = {
    name: {
        exists: true,
        isString: true
    },
    target: {
        exists: true,
        isString: true
    },
    type: {
        exists: true,
        isIn : {
            options : [["many-to-many","one-to-many","one-to-one"]]
        }
    },
    inverseRelationName: {
        optional: true,
        isString: true
    }
}

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
