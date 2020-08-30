import { Column } from "../interfaces/generator.interface";

export function buildModelColumnArgumentsFromObject(dbColumnaData: Column) {

    const columnArgument = {};

    columnArgument["type"] = dbColumnaData.type;
    columnArgument["default"] = dbColumnaData.default;

    // handle nullable
    if (!dbColumnaData.isUnique && !dbColumnaData.isPrimary) {
        columnArgument["nullable"] = dbColumnaData.nullable;
    }else if (dbColumnaData.isUnique) {
        columnArgument["unique"] = true;
    }
    else if (dbColumnaData.isPrimary) {
        columnArgument["primary"] = true;
    }

    columnArgument["length"] = dbColumnaData.length;

    return columnArgument;
};

export function buildValidationArgumentsFromObject(dbColumnaData: Column) {

    const validationArguments = {};

    if (!dbColumnaData.nullable) {
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
