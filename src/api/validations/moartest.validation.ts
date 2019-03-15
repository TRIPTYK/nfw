import * as Joi from "joi";

// GET /v1/moartest

export const listMoartests = {
  query: {}
};



// GET /v1/moartests/moartestId
export const getMoartest = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/moartests
export const createMoartest = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/moartests/:Id

export const replaceMoartest =  {
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



// PATCH /v1/moartests/:Id
export const updateMoartest =  {
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

