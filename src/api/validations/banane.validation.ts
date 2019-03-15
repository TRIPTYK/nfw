import * as Joi from "joi";

// GET /v1/banane

export const listBananes = {
  query: {}
};



// GET /v1/bananes/bananeId
export const getBanane = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/bananes
export const createBanane = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/bananes/:Id

export const replaceBanane =  {
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



// PATCH /v1/bananes/:Id
export const updateBanane =  {
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

