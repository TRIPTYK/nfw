"use strict";
exports.__esModule = true;
var Joi = require("joi");
// GET /v1/documents
var listDocuments = {
    query: {
        page: Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
        fieldname: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
        mimetype: Joi.string(),
        size: Joi.string()
    }
};
exports.listDocuments = listDocuments;
// GET /v1/documents/:documentId
var getDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.getDocument = getDocument;
// PUT /v1/documents/:documentId
var replaceDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.replaceDocument = replaceDocument;
// PATCH /v1/documents/:documentId
var updateDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.updateDocument = updateDocument;
// DELETE /v1/documents/:documentId
var deleteDocument = {
    params: {
        documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
    }
};
exports.deleteDocument = deleteDocument;
