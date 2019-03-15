import * as Joi from "joi";

// GET /v1/colde_one

export const listColde_ones = {
  query: {}
};



// GET /v1/colde_ones/colde_oneId
export const getColde_one = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/colde_ones
export const createColde_one = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/colde_ones/:Id

export const replaceColde_one =  {
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



// PATCH /v1/colde_ones/:Id
export const updateColde_one =  {
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

