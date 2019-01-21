import { Request, Response } from "express";
import { User } from "./../models/user.model";
import * as HttpStatus from "http-status";
import { omit } from "lodash";
import { db } from "./../../config/environment.config";

const userRepository = db.getRepository(User);

/**
 * Get serialized user
 * 
 * @param {Object} req
 * @param {Object} res
 * 
 * @public
 */
const get = (req: Request, res : Response) => res.json( req.locals.user.transform() );

/**
 * Get logged in user info
 * 
 * @param {Object} req
 * @param {Object} res
 * 
 * @public
 */
const loggedIn = (req: Request, res : Response) => res.json( req.user.transform() );

/**
 * Create new user
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * @public
 */
const create = async (req: Request, res : Response, next) => {
  try {
    const user = userRepository.create(req.body);
    const savedUser = await userRepository.save(user);
    res.status(HttpStatus.CREATED);
    res.json(savedUser.transform());
  } 
  catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * @public
 */
const replace = async (req: Request, res : Response, next) => {
  try {
    const user = await userRepository.findOne(req.params.userId);
    userRepository.merge(user, req.body);
    userRepository.save(user);
    res.json( user.transform() );
  } 
  catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * @public
 */
const update = async (req: Request, res : Response, next) => {

  try {
    const user = await userRepository.findOne(req.params.userId);
    userRepository.merge(user, req.body);
    userRepository.save(user);
    res.json( user.transform() );
  }
  catch(e) {
    next(User.checkDuplicateEmail(e));
  }
  
};

/**
 * Get user list
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * @public
 */
const list = async (req: Request, res : Response, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } 
  catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
const remove = (req: Request, res : Response, next) => {

  try {
    const { user } = req.locals;
    user
      .remove()
      .then( () => res.status(HttpStatus.NO_CONTENT).end() )
      .catch( e => next(e) );
  }
  catch(e) {
    next(e)
  }
  
};

export { get, loggedIn, create, replace, update, remove, list };