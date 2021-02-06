import { ColumnOptions, ColumnType } from "typeorm";
import { ValidationSchema } from "../../types/validation";
import { EntityColumn } from "../interfaces/generator.interface";

export function buildModelColumnArgumentsFromObject(
    dbColumnaData: EntityColumn
): ColumnOptions {
    const columnArgument: ColumnOptions = {};

    columnArgument.type = dbColumnaData.type as ColumnType;

    if (dbColumnaData.default !== undefined) {
        if (
            dbColumnaData.isNullable !== false &&
            dbColumnaData.default !== null
        ) {
            columnArgument.default = dbColumnaData.default;
        }
    }

    if (dbColumnaData.type.includes("int")) {
        if (dbColumnaData.length) {
            throw new Error(
                "Length must not be used with int types , use width instead"
            );
        }
    }

    if (dbColumnaData.scale) {
        columnArgument.scale = dbColumnaData.scale;
    }

    if (dbColumnaData.precision) {
        columnArgument.precision = dbColumnaData.precision;
    }

    // handle nullable
    if (!dbColumnaData.isUnique && !dbColumnaData.isPrimary) {
        columnArgument.nullable ??= dbColumnaData.isNullable;
    } else if (dbColumnaData.isUnique) {
        columnArgument.unique = true;
    } else if (dbColumnaData.isPrimary) {
        columnArgument.primary = true;
    }

    if (dbColumnaData.length) {
        columnArgument.length = dbColumnaData.length;
    }

    if (dbColumnaData.width) {
        columnArgument.width = dbColumnaData.width;
    }

    return columnArgument;
}

export function buildValidationArgumentsFromObject(
    dbColumnaData: EntityColumn
): ValidationSchema<any> {
    const validationArguments = {};

    if (!dbColumnaData.isNullable) {
        validationArguments["exists"] = true;
    } else {
        validationArguments["optional"] = {
            options: {
                nullable: true,
                checkFalsy: true
            }
        };
    }

    if (dbColumnaData.length) {
        validationArguments["isLength"] = {
            errorMessage: `Maximum length is ${dbColumnaData.length}`,
            options: { min: 0, max: dbColumnaData.length }
        };
    }

    if (["email", "mail"].includes(dbColumnaData.name)) {
        validationArguments["isEmail"] = {
            errorMessage: "Email is not valid"
        };
    }

    if (
        dbColumnaData.type.includes("text") ||
        dbColumnaData.type.includes("char")
    ) {
        validationArguments["isString"] = {
            errorMessage: "This field must be a string"
        };
    }

    if (dbColumnaData.type === "decimal") {
        validationArguments["isDecimal"] = {
            errorMessage: "This field must be decimal"
        };
    }

    if (dbColumnaData.type === "int") {
        validationArguments["isInt"] = {
            errorMessage: "This field must be an integer"
        };
    }

    if (dbColumnaData.type.includes("time")) {
        validationArguments["isISO8601"] = true;
    } else if (dbColumnaData.type.includes("date")) {
        validationArguments["isDate"] = true;
    }

    return validationArguments;
}
