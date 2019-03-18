import * as Joi from "joi";

// GET /v1/datetest

export const listDatetests = {
  query: {}
};



// GET /v1/datetests/datetestId
export const getDatetest = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/datetests
export const createDatetest = {
  body: {
    data : {
      attributes : { 
          datetest : Joi.date().required(),        
      }
    }
  }
};


// PUT /v1/datetests/:Id

export const replaceDatetest =  {
  body: {
    data : {
      attributes : { 
          datetest : Joi.date().required(),        
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// PATCH /v1/datetests/:Id
export const updateDatetest =  {
  body: {
    data : {
      attributes : { 
          datetest : Joi.date().required(),        
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

