import * as Joi from "joi";

// GET /v1/documents
const listDocuments = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    filename: Joi.string(),
    path: Joi.string(),
    mimetype: Joi.string(),
    size: Joi.string(),
  }
};

// POST /v1/documents/upload
const createDocument = {
  body: {
    filename: Joi.string().required().min(6).max(128),
  }
};

// PUT /v1/documents/:id
const replaceDocument = {
  body: {
    filename: Joi.string().required().min(6).max(128),
  }
};

// PATCH /v1/documents/:id
const updateDocument = {
  body: {
    filename: Joi.string().required().min(6).max(128),
  }
};

export { listDocuments, createDocument, replaceDocument, updateDocument };