import * as validate from "express-validation";

import { Router } from "express";
import { ChocolatController } from "./../../controllers/chocolat.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/chocolat.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { ChocolatMiddleware } from "./../../middlewares/chocolat.middleware";

const router = Router();

const chocolatController = new ChocolatController();
const chocolatMiddleware = new ChocolatMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/chocolats List Chocolats
   * @apiDescription Get a list of chocolats
   * @apiVersion 1.0.0
   * @apiName ListChocolats
   * @apiGroup Chocolat
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Chocolat's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Chocolats per page
   * @apiParam  {String=chocolat,admin}  [role]       Chocolat's role
   *
   * @apiSuccess {Object[]} chocolats List of chocolats.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated chocolats can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listChocolats), chocolatController.list)



  /**
   * @api {post} v1/chocolats Create Chocolat
   * @apiDescription Create a new chocolat
   * @apiVersion 1.0.0
   * @apiName CreateChocolat
   * @apiGroup Chocolat
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Chocolat's access token
   *
   *
   * @apiSuccess (Created 201) {String}  chocolat.id         Chocolat's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated chocolats can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createChocolat), SecurityMiddleware.sanitize, chocolatController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/chocolats/:id Get Chocolat
   * @apiDescription Get chocolat information
   * @apiVersion 1.0.0
   * @apiName GetChocolat
   * @apiGroup Chocolat
   * @apiPermission chocolat
   *
   * @apiHeader {String} Athorization  Chocolat's access token
   *
   * @apiSuccess {String}  id         Chocolat's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated chocolats can access the data
   * @apiError (Forbidden 403)    Forbidden    Only chocolat with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Chocolat does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getChocolat), chocolatController.get)



  /**
   * @api {put} v1/chocolats/:id Replace Chocolat
   * @apiDescription Replace the whole chocolat document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceChocolat
   * @apiGroup Chocolat
   * @apiPermission chocolat
   *
   * @apiHeader {String} Athorization  Chocolat's access token
   *
   * @apiParam  {String=chocolat,admin}  [role]    Chocolat's role
   * (You must be an admin to change the chocolat's role)
   *
   * @apiSuccess {String}  id         Chocolat's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated chocolats can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only chocolat with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Chocolat does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceChocolat), SecurityMiddleware.sanitize, chocolatController.update)



  /**
   * @api {patch} v1/chocolats/:id Update Chocolat
   * @apiDescription Update some fields of a chocolat document
   * @apiVersion 1.0.0
   * @apiName UpdateChocolat
   * @apiGroup Chocolat
   * @apiPermission chocolat
   *
   * @apiHeader {String} Authorization  Chocolat's access token
   *
   * @apiParam  {String=chocolat,admin}  [role]    Chocolat's role
   * (You must be an admin to change the chocolat's role)
   *
   * @apiSuccess {String}  id         Chocolat's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated chocolats can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only chocolat with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Chocolat does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateChocolat), SecurityMiddleware.sanitize, chocolatController.update)



  /**
   * @api {patch} v1/chocolats/:id Delete Chocolat
   * @apiDescription Delete a chocolat
   * @apiVersion 1.0.0
   * @apiName DeleteChocolat
   * @apiGroup Chocolat
   * @apiPermission chocolat
   *
   * @apiHeader {String} Athorization  Chocolat's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated chocolats can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only chocolat with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Chocolat does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, chocolatController.remove);


export { router };
