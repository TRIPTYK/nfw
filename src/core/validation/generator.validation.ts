import { container } from "tsyringe";
import {
    EntityColumn,
    EntityRelation
} from "../generator/interfaces/generator.interface";
import TypeORMService from "../services/typeorm.service";
import { ValidationSchema } from "../types/validation";

export const createEntity: ValidationSchema<any> = {
    columns: {
        exists: true,
        isArray: true
    },
    "columns.*.name": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    "columns.*.type": {
        exists: true,
        isString: true,
        custom: {
            options: (value) => {
                const suported = container.resolve(TypeORMService).connection
                    .driver.supportedDataTypes;
                if (!Object.values(suported).includes(value)) {
                    throw new Error("unsupported value");
                }
                return true;
            }
        }
    },
    "columns.*.default": {
        optional: true
    },
    "columns.*.length": {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    "columns.*.width": {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    "columns.*.precision": {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    "columns.*.scale": {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    "columns.*.isUnique": {
        optional: true,
        isBoolean: true,
        toBoolean: true
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true,
        toBoolean: true
    },
    relations: {
        exists: true,
        isArray: true
    },
    "relations.*.name": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    "relations.*.target": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    "relations.*.type": {
        exists: true,
        isIn: {
            options: [["many-to-many", "one-to-many", "one-to-one"]]
        }
    },
    "relations.*.inverseRelationName": {
        optional: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    }
};

export const createRelation: ValidationSchema<EntityRelation> = {
    name: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    target: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    type: {
        exists: true,
        isIn: {
            options: [["many-to-many", "one-to-many", "one-to-one"]]
        }
    },
    inverseRelationName: {
        optional: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    isNullable: {
        optional: true,
        isBoolean: true,
        toBoolean: true
    }
};

export const createColumn: ValidationSchema<EntityColumn> = {
    name: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        }
    },
    type: {
        exists: true,
        isString: true,
        custom: {
            options: (value) => {
                const suported = container.resolve(TypeORMService).connection
                    .driver.supportedDataTypes;
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
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    width: {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    precision: {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
    },
    scale: {
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isInt: true,
        toInt: true
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
};

export const columnsActions: ValidationSchema<any> = {
    ...exports.createEntity,
    "columns.*.action": {
        exists: true,
        isIn: {
            options: [["ADD", "REMOVE"]]
        }
    },
    "relations.*.action": {
        exists: true,
        isIn: {
            options: [["ADD", "REMOVE"]]
        }
    }
};
