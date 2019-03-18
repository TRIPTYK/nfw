import * as Joi from "joi";

// GET /v1/track

export const listTracks = {
  query: {}
};



// GET /v1/tracks/trackId
export const getTrack = {
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// POST /v1/tracks
export const createTrack = {
  body: {
    data : {
      attributes : { 
          title : Joi.string().max(255).required(),        
      }
    }
  }
};


// PUT /v1/tracks/:Id

export const replaceTrack =  {
  body: {
    data : {
      attributes : { 
          title : Joi.string().max(255).required(),        
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};



// PATCH /v1/tracks/:Id
export const updateTrack =  {
  body: {
    data : {
      attributes : { 
          title : Joi.string().max(255).required(),        
      }
    }
  },
  params: {
    id: Joi.string().regex(/^[0-9]{0,4}$/).required(),
  }
};

