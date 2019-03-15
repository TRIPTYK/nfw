import * as Joi from "joi";

// GET /v1/plz

export const listPlzs = {
  query: {}
};



// GET /v1/plzs/plzId
export const getPlz = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/plzs
export const createPlz = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/plzs/:Id

export const replacePlz =  {
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



// PATCH /v1/plzs/:Id
export const updatePlz =  {
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

