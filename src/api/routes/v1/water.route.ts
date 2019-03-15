import * as validate from "express-validation";

import { Router } from "express";
import { WaterController } from "./../../controllers/water.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/water.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { WaterMiddleware } from "./../../middlewares/water.middleware";

const router = Router();

const waterController = new WaterController();
const waterMiddleware = new WaterMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/waters List Waters
   * @apiDescription Get a list of waters
   * @apiVersion 1.0.0
   * @apiName ListWaters
   * @apiGroup Water
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Water's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Waters per page
   * @apiParam  {String=water,admin}  [role]       Water's role
   *
   * @apiSuccess {Object[]} waters List of waters.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated waters can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listWaters), waterController.list)



  /**
   * @api {post} v1/waters Create Water
   * @apiDescription Create a new water
   * @apiVersion 1.0.0
   * @apiName CreateWater
   * @apiGroup Water
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Water's access token
   *
   *
   * @apiSuccess (Created 201) {String}  water.id         Water's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated waters can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createWater), SecurityMiddleware.sanitize, waterController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/waters/:id Get Water
   * @apiDescription Get water information
   * @apiVersion 1.0.0
   * @apiName GetWater
   * @apiGroup Water
   * @apiPermission water
   *
   * @apiHeader {String} Athorization  Water's access token
   *
   * @apiSuccess {String}  id         Water's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated waters can access the data
   * @apiError (Forbidden 403)    Forbidden    Only water with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Water does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getWater), waterController.get)



  /**
   * @api {put} v1/waters/:id Replace Water
   * @apiDescription Replace the whole water document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceWater
   * @apiGroup Water
   * @apiPermission water
   *
   * @apiHeader {String} Athorization  Water's access token
   *
   * @apiParam  {String=water,admin}  [role]    Water's role
   * (You must be an admin to change the water's role)
   *
   * @apiSuccess {String}  id         Water's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated waters can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only water with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Water does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceWater), SecurityMiddleware.sanitize, waterController.update)



  /**
   * @api {patch} v1/waters/:id Update Water
   * @apiDescription Update some fields of a water document
   * @apiVersion 1.0.0
   * @apiName UpdateWater
   * @apiGroup Water
   * @apiPermission water
   *
   * @apiHeader {String} Authorization  Water's access token
   *
   * @apiParam  {String=water,admin}  [role]    Water's role
   * (You must be an admin to change the water's role)
   *
   * @apiSuccess {String}  id         Water's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated waters can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only water with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Water does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateWater), SecurityMiddleware.sanitize, waterController.update)



  /**
   * @api {patch} v1/waters/:id Delete Water
   * @apiDescription Delete a water
   * @apiVersion 1.0.0
   * @apiName DeleteWater
   * @apiGroup Water
   * @apiPermission water
   *
   * @apiHeader {String} Athorization  Water's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated waters can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only water with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Water does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, waterController.remove);


export { router };
