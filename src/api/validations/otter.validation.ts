import * as Joi from "joi";

// GET /v1/otter

export const listOtters = {
  query: {}
};


// GET /v1/otters/otterId
export const getOtter = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};


// POST /v1/otters
export const createOtter = {
  body: {  }
};


// PUT /v1/otters/:Id

export const replaceOtter =  {
  body: {  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};


// PATCH /v1/otters/:Id
export const updateOtter =  {
  body: {  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

