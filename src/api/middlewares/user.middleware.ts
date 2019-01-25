import * as Boom from "boom";

import { Request, Response } from "express";
import { UserRepository } from "./../repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { User } from "./../models/user.model";

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

export { load };