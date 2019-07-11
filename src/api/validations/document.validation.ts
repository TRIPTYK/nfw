// GET /v1/documents/:documentId
import {Schema} from "express-validator";

const getDocument: Schema = {
    documentId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    }
};

// PATCH /v1/documents/:documentId
const updateDocument: Schema = {
    documentId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    }
};

// DELETE /v1/documents/:documentId
const deleteDocument: Schema = {
    documentId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    }
};

export {getDocument, updateDocument, deleteDocument};
