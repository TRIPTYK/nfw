import * as Joi from "joi";

// GET /v1/documents
const listDocuments = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    fieldname: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    mimetype: Joi.string(),
    size: Joi.string(),
  }
};

// GET /v1/documents/:documentId
const getDocument = {
  params: {
    documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
}

// PUT /v1/documents/:documentId
const replaceDocument = {
  params: {
    documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
}

// PATCH /v1/documents/:documentId
const updateDocument = {
  params: {
    documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
}

// DELETE /v1/documents/:documentId
const deleteDocument = {
  params: {
    documentId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
}

export { listDocuments, getDocument, replaceDocument, updateDocument, deleteDocument };