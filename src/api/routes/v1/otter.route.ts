import * as validate from "express-validation";

import { Router } from "express";
import { OtterController } from "./../../controllers/otter.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/otter.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { OtterMiddleware } from "./../../middlewares/otter.middleware";

const router = Router();

const otterController = new OtterController();
const otterMiddleware = new OtterMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/otters List Otters
   * @apiDescription Get a list of otters
   * @apiVersion 1.0.0
   * @apiName ListOtters
   * @apiGroup Otter
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Otters per page
   * @apiParam  {String}             [name]       Otter's name
   * @apiParam  {String}             [email]      Otter's email
   * @apiParam  {String=otter,admin}  [role]       Otter's role
   *
   * @apiSuccess {Object[]} otters List of otters.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated otters can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN]), validate(Validation.listOtters), otterController.list)



  /**
   * @api {post} v1/otters Create Otter
   * @apiDescription Create a new otter
   * @apiVersion 1.0.0
   * @apiName CreateOtter
   * @apiGroup Otter
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiParam  {String}             email     Otter's email
   * @apiParam  {String{8..16}}     password   Otter's password
   * @apiParam  {String{..32}}      [name]     Otter's ottername
   * @apiParam  {String=otter,admin}  [role]    Otter's role
   *
   * @apiSuccess (Created 201) {String}  otter.id         Otter's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated otters can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN]), validate(Validation.createOtter), SecurityMiddleware.sanitize, otterController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/otters/:id Get Otter
   * @apiDescription Get otter information
   * @apiVersion 1.0.0
   * @apiName GetOtter
   * @apiGroup Otter
   * @apiPermission otter
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiSuccess {String}  id         Otter's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated otters can access the data
   * @apiError (Forbidden 403)    Forbidden    Only otter with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Otter does not exist
   */
  .get(authorize([ADMIN, LOGGED_USER]), validate(Validation.getOtter), otterController.get)



  /**
   * @api {put} v1/otters/:id Replace Otter
   * @apiDescription Replace the whole otter document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceOtter
   * @apiGroup Otter
   * @apiPermission otter
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiParam  {String=otter,admin}  [role]    Otter's role
   * (You must be an admin to change the otter's role)
   *
   * @apiSuccess {String}  id         Otter's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated otters can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only otter with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Otter does not exist
   */
  .put(authorize([ADMIN, LOGGED_USER]), validate(Validation.replaceOtter), SecurityMiddleware.sanitize, otterController.update)



  /**
   * @api {patch} v1/otters/:id Update Otter
   * @apiDescription Update some fields of a otter document
   * @apiVersion 1.0.0
   * @apiName UpdateOtter
   * @apiGroup Otter
   * @apiPermission otter
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiParam  {String}             email     Otter's email
   * @apiParam  {String{6..128}}     password  Otter's password
   * @apiParam  {String{..128}}      [name]    Otter's name
   * @apiParam  {String=otter,admin}  [role]    Otter's role
   * (You must be an admin to change the otter's role)
   *
   * @apiSuccess {String}  id         Otter's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated otters can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only otter with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Otter does not exist
   */
  .patch(authorize([ADMIN, LOGGED_USER]), validate(Validation.updateOtter), SecurityMiddleware.sanitize, otterController.update)



  /**
   * @api {patch} v1/otters/:id Delete Otter
   * @apiDescription Delete a otter
   * @apiVersion 1.0.0
   * @apiName DeleteOtter
   * @apiGroup Otter
   * @apiPermission otter
   *
   * @apiHeader {String} Athorization  Otter's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated otters can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only otter with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Otter does not exist
   */
  .delete(authorize([ADMIN, LOGGED_USER]), SecurityMiddleware.sanitize, otterController.remove);


export { router };
