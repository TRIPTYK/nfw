import * as Joi from "joi";

// GET /v1/documents
const listDocuments = {
  query: {}
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
