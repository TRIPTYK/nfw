import * as Joi from "joi";

// GET /v1/chocolat

export const listChocolats = {
  query: {}
};



// GET /v1/chocolats/chocolatId
export const getChocolat = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/chocolats
export const createChocolat = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/chocolats/:Id

export const replaceChocolat =  {
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



// PATCH /v1/chocolats/:Id
export const updateChocolat =  {
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

