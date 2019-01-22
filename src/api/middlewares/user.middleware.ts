import { Request, Response } from "express";
import { UserRepository } from "./../repositories/user.repository";

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
    const userRepository = new UserRepository();
    req['locals']['user'] = await userRepository.get(id);
    return next();
  } 
  catch (error) {
    return next(error);
  }
};

export { load };