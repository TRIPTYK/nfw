import * as Joi from "joi";

// GET /v1/kicker

export const listKickers = {
  query: {}
};



// GET /v1/kickers/kickerId
export const getKicker = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/kickers
export const createKicker = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/kickers/:Id

export const replaceKicker =  {
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



// PATCH /v1/kickers/:Id
export const updateKicker =  {
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

