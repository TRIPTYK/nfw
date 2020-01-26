// GET /v1/documents/:documentId
import {Schema} from "express-validator";
import { MimeTypes } from "../enums/mime-type.enum";
import * as Boom from "@hapi/boom";

export const getDocument: Schema = {
    documentId: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

// PATCH /v1/documents/:documentId
export const updateDocument: Schema = {
    documentId: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true
    }
};

// DELETE /v1/documents/:documentId
export const deleteDocument: Schema = {
    documentId: {
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
    file: {mimetype: string, destination: string, filename: string, fieldname: string, path: string, size: string},
    next) => {
    if (Object.values(MimeTypes).includes(file.mimetype as any)) {
        return next(null, true);
    }
    return next(Boom.unsupportedMediaType("File mimetype not supported"), false);
};

