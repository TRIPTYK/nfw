import { logger as Logger } from "./../../config/logger.config";
import * as Notifier from "node-notifier";
import * as Boom from "boom";
import { Request , Response } from "express";
import { Error } from "jsonapi-serializer";


/**
 * @param {Boom} error
 */
const _getErrorCode = (error : Boom) : number => {

  if(typeof(error.httpStatusCode) !== 'undefined') return error.httpStatusCode;
  if(typeof(error.status) !== 'undefined') return error.status;
  if(error.isBoom) return error.output.statusCode;

  return 500;
};

/**
 * @param {Boom} err
 */
const _boomToJSONAPI = (err : Boom) => {
  return new Error({
    status:  _getErrorCode(err).toString(),
    title:  err.output ? err.output.payload.error : "Error",
    meta : { validation :  err.errors ? err.errors : undefined  },
    detail: err.message
  });
};

/**
 * Write errors in a log file
 *
 * @param {*} req
 * @param res
 * @param next
 */
const log = (req : Request,res : Response,next : Function) => {
  let message = 'Error in ' + req.method + ' ' + req.url + '\n';
  Logger.error(message);
  next();
};

/**
 * Display error in desktop notification
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 */
const notify = (err, str, req) => {
  let title = 'Error in ' + req.method + ' ' + req.url;
  Notifier.notify({
    title : title,
    message : str
  });
};

/**
 * Display clean error for final user when whe are on the last stack step
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const notFound = (req, res, next) => {
  res.status( 404 );
  res.json( _boomToJSONAPI(Boom.notFound('End point not found')) );
};


const developmentErrors = (err,req ,res) => {
  console.log(`[DEV] : an error has occured : ${err}`);
  
  if(!err.httpStatusCode && !err.status && !err.isBoom)
    err = Boom.expectationFailed(err.message);

  res.status( _getErrorCode(err) );
  res.json(_boomToJSONAPI(err));
};

const productionErrors = (err,req,res) => {
  if(!err.httpStatusCode && !err.status && !err.isBoom)
    err = Boom.expectationFailed(err.message);

  res.status( _getErrorCode(err) );
  res.json(_boomToJSONAPI(err));
};

export { log, notify , notFound , developmentErrors , productionErrors };
