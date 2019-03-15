import * as Joi from "joi";

// GET /v1/abort

export const listAborts = {
  query: {}
};



// GET /v1/aborts/abortId
export const getAbort = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/aborts
export const createAbort = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/aborts/:Id

export const replaceAbort =  {
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



// PATCH /v1/aborts/:Id
export const updateAbort =  {
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

