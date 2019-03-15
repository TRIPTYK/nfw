import * as validate from "express-validation";

import { Router } from "express";
import { SandwichController } from "./../../controllers/sandwich.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/sandwich.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { SandwichMiddleware } from "./../../middlewares/sandwich.middleware";

const router = Router();

const sandwichController = new SandwichController();
const sandwichMiddleware = new SandwichMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/sandwichs List Sandwichs
   * @apiDescription Get a list of sandwichs
   * @apiVersion 1.0.0
   * @apiName ListSandwichs
   * @apiGroup Sandwich
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Sandwich's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Sandwichs per page
   * @apiParam  {String=sandwich,admin}  [role]       Sandwich's role
   *
   * @apiSuccess {Object[]} sandwichs List of sandwichs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated sandwichs can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listSandwichs), sandwichController.list)



  /**
   * @api {post} v1/sandwichs Create Sandwich
   * @apiDescription Create a new sandwich
   * @apiVersion 1.0.0
   * @apiName CreateSandwich
   * @apiGroup Sandwich
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Sandwich's access token
   *
   *
   * @apiSuccess (Created 201) {String}  sandwich.id         Sandwich's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated sandwichs can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createSandwich), SecurityMiddleware.sanitize, sandwichController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/sandwichs/:id Get Sandwich
   * @apiDescription Get sandwich information
   * @apiVersion 1.0.0
   * @apiName GetSandwich
   * @apiGroup Sandwich
   * @apiPermission sandwich
   *
   * @apiHeader {String} Athorization  Sandwich's access token
   *
   * @apiSuccess {String}  id         Sandwich's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated sandwichs can access the data
   * @apiError (Forbidden 403)    Forbidden    Only sandwich with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Sandwich does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getSandwich), sandwichController.get)



  /**
   * @api {put} v1/sandwichs/:id Replace Sandwich
   * @apiDescription Replace the whole sandwich document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceSandwich
   * @apiGroup Sandwich
   * @apiPermission sandwich
   *
   * @apiHeader {String} Athorization  Sandwich's access token
   *
   * @apiParam  {String=sandwich,admin}  [role]    Sandwich's role
   * (You must be an admin to change the sandwich's role)
   *
   * @apiSuccess {String}  id         Sandwich's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated sandwichs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only sandwich with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Sandwich does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceSandwich), SecurityMiddleware.sanitize, sandwichController.update)



  /**
   * @api {patch} v1/sandwichs/:id Update Sandwich
   * @apiDescription Update some fields of a sandwich document
   * @apiVersion 1.0.0
   * @apiName UpdateSandwich
   * @apiGroup Sandwich
   * @apiPermission sandwich
   *
   * @apiHeader {String} Authorization  Sandwich's access token
   *
   * @apiParam  {String=sandwich,admin}  [role]    Sandwich's role
   * (You must be an admin to change the sandwich's role)
   *
   * @apiSuccess {String}  id         Sandwich's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated sandwichs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only sandwich with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Sandwich does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateSandwich), SecurityMiddleware.sanitize, sandwichController.update)



  /**
   * @api {patch} v1/sandwichs/:id Delete Sandwich
   * @apiDescription Delete a sandwich
   * @apiVersion 1.0.0
   * @apiName DeleteSandwich
   * @apiGroup Sandwich
   * @apiPermission sandwich
   *
   * @apiHeader {String} Athorization  Sandwich's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated sandwichs can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only sandwich with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Sandwich does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, sandwichController.remove);


export { router };
