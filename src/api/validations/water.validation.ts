import * as Joi from "joi";

// GET /v1/water

export const listWaters = {
  query: {}
};



// GET /v1/waters/waterId
export const getWater = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/waters
export const createWater = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/waters/:Id

export const replaceWater =  {
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



// PATCH /v1/waters/:Id
export const updateWater =  {
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

