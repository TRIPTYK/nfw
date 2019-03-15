import * as validate from "express-validation";

import { Router } from "express";
import { PlzController } from "./../../controllers/plz.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/plz.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { PlzMiddleware } from "./../../middlewares/plz.middleware";

const router = Router();

const plzController = new PlzController();
const plzMiddleware = new PlzMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/plzs List Plzs
   * @apiDescription Get a list of plzs
   * @apiVersion 1.0.0
   * @apiName ListPlzs
   * @apiGroup Plz
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Plz's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Plzs per page
   * @apiParam  {String=plz,admin}  [role]       Plz's role
   *
   * @apiSuccess {Object[]} plzs List of plzs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated plzs can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listPlzs), plzController.list)



  /**
   * @api {post} v1/plzs Create Plz
   * @apiDescription Create a new plz
   * @apiVersion 1.0.0
   * @apiName CreatePlz
   * @apiGroup Plz
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Plz's access token
   *
   *
   * @apiSuccess (Created 201) {String}  plz.id         Plz's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated plzs can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createPlz), SecurityMiddleware.sanitize, plzController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/plzs/:id Get Plz
   * @apiDescription Get plz information
   * @apiVersion 1.0.0
   * @apiName GetPlz
   * @apiGroup Plz
   * @apiPermission plz
   *
   * @apiHeader {String} Athorization  Plz's access token
   *
   * @apiSuccess {String}  id         Plz's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated plzs can access the data
   * @apiError (Forbidden 403)    Forbidden    Only plz with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Plz does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getPlz), plzController.get)



  /**
   * @api {put} v1/plzs/:id Replace Plz
   * @apiDescription Replace the whole plz document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplacePlz
   * @apiGroup Plz
   * @apiPermission plz
   *
   * @apiHeader {String} Athorization  Plz's access token
   *
   * @apiParam  {String=plz,admin}  [role]    Plz's role
   * (You must be an admin to change the plz's role)
   *
   * @apiSuccess {String}  id         Plz's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated plzs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only plz with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Plz does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replacePlz), SecurityMiddleware.sanitize, plzController.update)



  /**
   * @api {patch} v1/plzs/:id Update Plz
   * @apiDescription Update some fields of a plz document
   * @apiVersion 1.0.0
   * @apiName UpdatePlz
   * @apiGroup Plz
   * @apiPermission plz
   *
   * @apiHeader {String} Authorization  Plz's access token
   *
   * @apiParam  {String=plz,admin}  [role]    Plz's role
   * (You must be an admin to change the plz's role)
   *
   * @apiSuccess {String}  id         Plz's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated plzs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only plz with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Plz does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updatePlz), SecurityMiddleware.sanitize, plzController.update)



  /**
   * @api {patch} v1/plzs/:id Delete Plz
   * @apiDescription Delete a plz
   * @apiVersion 1.0.0
   * @apiName DeletePlz
   * @apiGroup Plz
   * @apiPermission plz
   *
   * @apiHeader {String} Athorization  Plz's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated plzs can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only plz with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Plz does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, plzController.remove);


export { router };
