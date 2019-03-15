import * as Joi from "joi";

// GET /v1/banana

export const listBananas = {
  query: {}
};



// GET /v1/bananas/bananaId
export const getBanana = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/bananas
export const createBanana = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/bananas/:Id

export const replaceBanana =  {
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



// PATCH /v1/bananas/:Id
export const updateBanana =  {
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

