import * as Joi from "joi";

// GET /v1/sandwich

export const listSandwichs = {
  query: {}
};



// GET /v1/sandwichs/sandwichId
export const getSandwich = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/sandwichs
export const createSandwich = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/sandwichs/:Id

export const replaceSandwich =  {
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



// PATCH /v1/sandwichs/:Id
export const updateSandwich =  {
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

