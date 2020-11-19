import { container } from "tsyringe";
import { Column, Relation } from "../cli/interfaces/generator.interface";
import TypeORMService from "../services/typeorm.service";
import { ValidationSchema } from "../types/validation";

export const createEntity: ValidationSchema<any> = {
    columns:{
        exists: true,
        isArray: true
    },
    "columns.*.name": {
        exists: true,
        isString: true,
        isAscii : true
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
        optional:true
    },
    "columns.*.length": {
        optional:true,
        isInt: true,
        toInt:true
    },
    "columns.*.width": {
        optional:true,
        isInt: true,
        toInt:true
    },
    "columns.*.isUnique": {
        optional:true,
        isBoolean: true,
        toBoolean: true
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true,
        toBoolean: true
    },
    relations:{
        exists: true,
        isArray: true
    },
    "relations.*.name": {
        exists: true,
        isString: true,
        isAscii : true
    },
    "relations.*.target": {
        exists: true,
        isString: true,
        isAscii : true
    },
    "relations.*.type": {
        exists: true,
        isIn : {
            options : [["many-to-many", "one-to-many", "one-to-one"]]
        }
    },
    "relations.*.inverseRelationName": {
        optional: true,
        isString: true,
        isAscii : true
    }
};

export const createRelation: ValidationSchema<Relation> = {
    name: {
        exists: true,
        isString: true,
        isAscii : true
    },
    target: {
        exists: true,
        isString: true,
        isAscii : true
    },
    type: {
        exists: true,
        isIn : {
            options : [["many-to-many", "one-to-many", "one-to-one"]]
        }
    },
    inverseRelationName: {
        optional: true,
        isString: true,
        isAscii : true
    },
    isNullable: {
        optional: true,
        isBoolean: true,
        toBoolean: true
    }
}

export const createColumn: ValidationSchema<Column> = {
    name: {
        exists: true,
        isString: true,
        isAscii : true
    },
    type: {
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
    default: {
        optional: true
    },
    length: {
        exists: true,
        isInt: true,
        toInt:true
    },
    width: {
        optional:true,
        isInt: true,
        toInt:true
    },
    isUnique: {
        exists: true,
        isBoolean: true,
        toBoolean: true
    },
    isNullable: {
        exists: true,
        isBoolean: true,
        toBoolean: true
    }
}

export const columnsActions: ValidationSchema<any> = {
    columns:{
        exists: true,
        isArray: true
    },
    "columns.*.action":{
        exists : true,
        isIn : {
            options : [["ADD", "REMOVE"]]
        }
    },
    "columns.*.name": {
        exists: true,
        isString: true,
        isAscii : true
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
        optional:true
    },
    "columns.*.length": {
        optional:true,
        isInt: true,
        toInt:true
    },
    "columns.*.width": {
        optional:true,
        isInt: true,
        toInt:true
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true,
        toBoolean : true
    }
}

