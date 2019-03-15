import * as Joi from "joi";

// GET /v1/potato

export const listPotatos = {
  query: {}
};



// GET /v1/potatos/potatoId
export const getPotato = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/potatos
export const createPotato = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/potatos/:Id

export const replacePotato =  {
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



// PATCH /v1/potatos/:Id
export const updatePotato =  {
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

