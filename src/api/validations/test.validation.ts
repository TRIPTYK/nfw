import * as Joi from "joi";

// GET /v1/test

export const listTests = {
  query: {}
};



// GET /v1/tests/testId
export const getTest = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/tests
export const createTest = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/tests/:Id

export const replaceTest =  {
  body: {
    data : {
      attributes : { 
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// PATCH /v1/tests/:Id
export const updateTest =  {
  body: {
    data : {
      attributes : { 
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

