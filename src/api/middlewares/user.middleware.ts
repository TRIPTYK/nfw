import * as Boom from "boom";

import { Request, Response } from "express";
import { UserRepository } from "./../repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { User } from "./../models/user.model";
import { Deserializer as JSONAPIDeserializer } from "jsonapi-serializer";
import { whitelist } from "./../serializers/user.serializer";

/**
 * Load user and append to req
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {String} id 
 *
 * @returns {Function}
 *  
 * @public
 */
const load = async (req: Request, res: Response, next: Function, id: number) => {
  try {
    const repository = getCustomRepository(UserRepository);
    req['locals'] = new User(await repository.one(id));
    return next();
  } 
  catch (e) { return next(Boom.expectationFailed(e.message)); }
};

/**
 * Deserialize
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const deserialize = async(req: Request, res: Response, next: Function) => {
  try {
    
    let user = await new JSONAPIDeserializer({
      attributes: whitelist
    }).deserialize(req.body);

    req.body = {};

    for(let key in user)
    {
      if(key !== 'id') req.body[key] = user[key];
      else delete req.body[key];
    }

    return next();
  } 
  catch (e) { return next(Boom.expectationFailed(e.message)); }
}

export { load, deserialize };