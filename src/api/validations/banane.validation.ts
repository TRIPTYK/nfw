import * as Joi from "joi";

// GET /v1/banane
const listBananes = {
  query: {}
};

// GET /v1/bananes/bananeId
const getBanane = {
  params: {
    bananeId: Joi.string().regex(/^[0-9]{0,4}$/).required()
  }
};

// POST /v1/bananes
const createBanane = {
  body: {}
};

// PUT /v1/bananes/:bananeId
const replaceBanane = {
  body: {},
  params: {
    bananeId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

// PATCH /v1/bananes/:bananeId
const updateBanane = {
  body: {},
  params: {
    bananeId: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

export { listBananes, getBanane, createBanane, replaceBanane, updateBanane };