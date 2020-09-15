import { Column } from "../interfaces/generator.interface";
import { ColumnOptions, ColumnType } from "typeorm";
import { ValidationSchema } from "../../types/validation";

export function buildModelColumnArgumentsFromObject(dbColumnaData: Column): ColumnOptions {

    const columnArgument: ColumnOptions = {};

    columnArgument.type = dbColumnaData.type as ColumnType;

    if (dbColumnaData.default !== undefined) {
        if (dbColumnaData.isNullable !== false && dbColumnaData.default !== null) {
            columnArgument.default = dbColumnaData.default;
        }
    }

    if (dbColumnaData.type.includes("int")) {
        if (columnArgument.length) {
            throw new Error("Length must not be used with int types");
        }
    }

    // handle nullable
    if (!dbColumnaData.isUnique && !dbColumnaData.isPrimary) {
        columnArgument.nullable ??= dbColumnaData.isNullable;
    }else if (dbColumnaData.isUnique) {
        columnArgument.unique = true;
    }
    else if (dbColumnaData.isPrimary) {
        columnArgument.primary = true;
    }

    if (columnArgument.length) {
        columnArgument.length = dbColumnaData.length;
    }

    if (columnArgument.width) {
        columnArgument.width = dbColumnaData.width;
    }

    return columnArgument;
};

export function buildValidationArgumentsFromObject(dbColumnaData: Column): ValidationSchema<any> {

    const validationArguments = {};

    if (!dbColumnaData.isNullable) {
        validationArguments["exists"] = true;
    }
    else
    {
        validationArguments["optional"] = {
            options : {
                nullable: true,
                checkFalsy: true
            }
        };
    }

    if (dbColumnaData.length) {
        validationArguments["isLength"] = {
            errorMessage : `Maximum length is ${dbColumnaData.length}`,
            options: { min: 0 , max: dbColumnaData.length }
        };
    }
    else
    {
        validationArguments["optional"] = true;
    }

    if (dbColumnaData.name === "email")
    {
        validationArguments["isEmail"] = {
            errorMessage : "Email is not valid"
        };
    }

    if (dbColumnaData.type.includes("text") || dbColumnaData.type.includes("char")) {
        validationArguments["isString"] = {
            errorMessage : "This field must be a string"
        };
    }

    if (dbColumnaData.type === "decimal") {
        validationArguments["isDecimal"] = {
            errorMessage : "This field must be decimal"
        };
    }

    if (dbColumnaData.type === "int") {
        validationArguments["isInt"] = {
            errorMessage : "This field must be an integer"
        };
    }

    if (dbColumnaData.type.includes("time")) {
        delete validationArguments["isLength"];
        validationArguments["isISO8601"] = true;
    }else if (dbColumnaData.type.includes("date")) {
        delete validationArguments["isLength"];
        validationArguments["isDate"] = true;
    }

    return validationArguments;
};
