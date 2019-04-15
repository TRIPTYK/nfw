"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
// GET /v1/documents
const listDocuments = {
    query: {}
};
exports.listDocuments = listDocuments;
// GET /v1/documents/:documentId
const getDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.getDocument = getDocument;
// PUT /v1/documents/:documentId
const replaceDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.replaceDocument = replaceDocument;
// PATCH /v1/documents/:documentId
const updateDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.updateDocument = updateDocument;
// DELETE /v1/documents/:documentId
const deleteDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.deleteDocument = deleteDocument;
