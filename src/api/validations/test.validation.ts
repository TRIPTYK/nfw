import * as Joi from "joi";

// GET /v1/test
/*
const listTests = {
  query: {}
};
*/
/*
// GET /v1/tests/testId
const getTest = {
  params: {
    testId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
};
*/

// POST /v1/tests
const createTest = {
  body: {}
};


// PUT /v1/tests/:testId
/*
const replaceTest = {
  body: {},
  params: {
    testId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};
*/
/*
// PATCH /v1/tests/:testId
const updateTest = {
  body: {},
  params: {
    testId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};
*/

export { 
/*listTests,*/
/*getTest,*/
createTest,
/*replaceTest,*/
/*updateTest*/
};