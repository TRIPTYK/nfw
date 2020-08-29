
export function buildModelColumnArgumentsFromObject(dbColumnaData: any) {

    const columnArgument = {};

    columnArgument["type"] = dbColumnaData.Type.type;

    // handle default
    if (dbColumnaData.Default !== ":no")
    {columnArgument["default"] = dbColumnaData.Default;}

    if (dbColumnaData.Default === null && dbColumnaData.Null === "NO")
    {delete columnArgument["default"];}

    if(dbColumnaData.Default === undefined){
        delete columnArgument["default"];
    }

    // handle nullable
    if (dbColumnaData.Key !== "PRI" && dbColumnaData.Key !== "UNI") {
        columnArgument["nullable"] = dbColumnaData.Null === "YES";
    }else if (dbColumnaData.Key === "UNI")
    {columnArgument["unique"] = true;}
    else if (dbColumnaData.Key === "PRI")
    {columnArgument["primary"] = true;}

    // handle length
    if (dbColumnaData.Type.type === "enum") {
        columnArgument["enum"] = dbColumnaData.Type.length.split(",").map((e) => e.replace(/'|\\'/g,""));
        return columnArgument;
    }

    if (dbColumnaData.Type.type === "decimal") {
        const [precision,scale] = dbColumnaData.Type.length.split(",");
        columnArgument["precision"] = parseInt(precision,10);
        columnArgument["scale"] = parseInt(scale,10);
        return columnArgument;
    }

    if (dbColumnaData.Type.length !== undefined && dbColumnaData.Type.length !== "") {
        const length = parseInt(dbColumnaData.Type.length,10);

        if (dbColumnaData.Type.type.includes("int"))
        {columnArgument["width"] = length;}
        else if (dbColumnaData.Type.type.includes("date") || dbColumnaData.Type.type.includes("time") || dbColumnaData.Type.type === "year")
        {columnArgument["precision"] = length;}
        else
        {columnArgument["length"] = length;}
    }

    return columnArgument;
};

export function buildValidationArgumentsFromObject(dbColumnaData: any,isUpdate = false) {

    const validationArguments = {};

    if (!isUpdate && dbColumnaData.Null !== "NO" && dbColumnaData.Default !== "NULL")
    {validationArguments["exists"] = true;}
    else
    {validationArguments["optional"] = {
        options : {
            nullable: true,
            checkFalsy: true
        }
    };}

    if (dbColumnaData.Type.length)
    {validationArguments["isLength"] = {
        errorMessage : `Maximum length is ${dbColumnaData.Type.length}`,
        options: { min: 0 , max: parseInt(dbColumnaData.Type.length,10) }
    };}
    else
    {validationArguments["optional"] = true;}

    if (dbColumnaData.Field === "email")
    {validationArguments["isEmail"] = {
        errorMessage : "Email is not valid"
    };}

    if (dbColumnaData.Type.type.includes("text") || dbColumnaData.Type.type.includes("char")) {
        validationArguments["isString"] = {
            errorMessage : "This field must be a string"
        };
    }

    if (dbColumnaData.Type.type === "decimal") {
        validationArguments["isDecimal"] = {
            errorMessage : "This field must be decimal"
        };
    }

    if (dbColumnaData.Type.type === "int") {
        if (dbColumnaData.Type.length !== 1) {
            validationArguments["isInt"] = {
                errorMessage : "This field must be an integer"
            };
        }else{
            delete validationArguments["isLength"];
            validationArguments["isBoolean"] = {
                errorMessage : "This field must be a boolean"
            };
        }
    }

    if (dbColumnaData.Type.type.includes("time")) {
        delete validationArguments["isLength"];
        validationArguments["isISO8601"] = true;
    }else if (dbColumnaData.Type.type.includes("date")) {
        delete validationArguments["isLength"];
        validationArguments["isDate"] = true;
    }

    if (dbColumnaData.Type.type === "enum") {
        delete validationArguments["isLength"];
        validationArguments["isIn"] = {
            errorMessage : `Must be in these values : ${dbColumnaData.Type.length}`,
            options : [dbColumnaData.Type.length.split(",").map((e: string) => e.replace(/'|\\'/g,""))]
        };
    }

    return validationArguments;
};
