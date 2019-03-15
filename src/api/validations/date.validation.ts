import * as Joi from "joi";

// GET /v1/date

export const listDates = {
  query: {}
};



// GET /v1/dates/dateId
export const getDate = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/dates
export const createDate = {
  body: {
    data : {
      attributes : { 
      }
    }
  }
};


// PUT /v1/dates/:Id

export const replaceDate =  {
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



// PATCH /v1/dates/:Id
export const updateDate =  {
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

