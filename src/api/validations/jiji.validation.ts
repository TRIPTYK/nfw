import * as Joi from "joi";

// GET /v1/jiji

export const listJijis = {
  query: {}
};



// GET /v1/jijis/jijiId
export const getJiji = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/jijis
export const createJiji = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/jijis/:Id

export const replaceJiji =  {
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



// PATCH /v1/jijis/:Id
export const updateJiji =  {
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

