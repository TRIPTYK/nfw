import * as User from "./../models/user.model";

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
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } 
  catch (error) {
    return next(error);
  }
};