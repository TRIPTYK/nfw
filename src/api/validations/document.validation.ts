// GET /v1/documents/:id
import { MimeTypes } from "../enums/mime-type.enum";
import * as Boom from "@hapi/boom";
import { Document } from "../models/document.model";
import { ValidationSchema } from "../../core/types/validation";

export const get: ValidationSchema<Document> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

// PATCH /v1/documents/:id
export const update: ValidationSchema<Document> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

// DELETE /v1/documents/:id
export const remove: ValidationSchema<Document> = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

/**
 * @desc function to validate the file
 * @param file
 * @param cb
 */
export const validateFile = (req,
    file: {mimetype: string; destination: string; filename: string; fieldname: string; path: string; size: string},
    next) => {
    if (Object.values(MimeTypes).includes(file.mimetype as any)) {
        return next(null, true);
    }
    return next(Boom.unsupportedMediaType("File mimetype not supported"), false);
};

