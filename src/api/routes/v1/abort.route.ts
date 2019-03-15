import * as validate from "express-validation";

import { Router } from "express";
import { AbortController } from "./../../controllers/abort.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/abort.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { AbortMiddleware } from "./../../middlewares/abort.middleware";

const router = Router();

const abortController = new AbortController();
const abortMiddleware = new AbortMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/aborts List Aborts
   * @apiDescription Get a list of aborts
   * @apiVersion 1.0.0
   * @apiName ListAborts
   * @apiGroup Abort
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Abort's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Aborts per page
   * @apiParam  {String=abort,admin}  [role]       Abort's role
   *
   * @apiSuccess {Object[]} aborts List of aborts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated aborts can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listAborts), abortController.list)



  /**
   * @api {post} v1/aborts Create Abort
   * @apiDescription Create a new abort
   * @apiVersion 1.0.0
   * @apiName CreateAbort
   * @apiGroup Abort
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Abort's access token
   *
   *
   * @apiSuccess (Created 201) {String}  abort.id         Abort's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated aborts can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createAbort), SecurityMiddleware.sanitize, abortController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/aborts/:id Get Abort
   * @apiDescription Get abort information
   * @apiVersion 1.0.0
   * @apiName GetAbort
   * @apiGroup Abort
   * @apiPermission abort
   *
   * @apiHeader {String} Athorization  Abort's access token
   *
   * @apiSuccess {String}  id         Abort's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated aborts can access the data
   * @apiError (Forbidden 403)    Forbidden    Only abort with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Abort does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getAbort), abortController.get)



  /**
   * @api {put} v1/aborts/:id Replace Abort
   * @apiDescription Replace the whole abort document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceAbort
   * @apiGroup Abort
   * @apiPermission abort
   *
   * @apiHeader {String} Athorization  Abort's access token
   *
   * @apiParam  {String=abort,admin}  [role]    Abort's role
   * (You must be an admin to change the abort's role)
   *
   * @apiSuccess {String}  id         Abort's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated aborts can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only abort with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Abort does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceAbort), SecurityMiddleware.sanitize, abortController.update)



  /**
   * @api {patch} v1/aborts/:id Update Abort
   * @apiDescription Update some fields of a abort document
   * @apiVersion 1.0.0
   * @apiName UpdateAbort
   * @apiGroup Abort
   * @apiPermission abort
   *
   * @apiHeader {String} Authorization  Abort's access token
   *
   * @apiParam  {String=abort,admin}  [role]    Abort's role
   * (You must be an admin to change the abort's role)
   *
   * @apiSuccess {String}  id         Abort's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated aborts can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only abort with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Abort does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateAbort), SecurityMiddleware.sanitize, abortController.update)



  /**
   * @api {patch} v1/aborts/:id Delete Abort
   * @apiDescription Delete a abort
   * @apiVersion 1.0.0
   * @apiName DeleteAbort
   * @apiGroup Abort
   * @apiPermission abort
   *
   * @apiHeader {String} Athorization  Abort's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated aborts can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only abort with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Abort does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, abortController.remove);


export { router };
