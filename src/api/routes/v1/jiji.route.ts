import * as validate from "express-validation";

import { Router } from "express";
import { JijiController } from "./../../controllers/jiji.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/jiji.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { JijiMiddleware } from "./../../middlewares/jiji.middleware";

const router = Router();

const jijiController = new JijiController();
const jijiMiddleware = new JijiMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/jijis List Jijis
   * @apiDescription Get a list of jijis
   * @apiVersion 1.0.0
   * @apiName ListJijis
   * @apiGroup Jiji
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Jiji's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Jijis per page
   * @apiParam  {String=jiji,admin}  [role]       Jiji's role
   *
   * @apiSuccess {Object[]} jijis List of jijis.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated jijis can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listJijis), jijiController.list)



  /**
   * @api {post} v1/jijis Create Jiji
   * @apiDescription Create a new jiji
   * @apiVersion 1.0.0
   * @apiName CreateJiji
   * @apiGroup Jiji
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Jiji's access token
   *
   *
   * @apiSuccess (Created 201) {String}  jiji.id         Jiji's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated jijis can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createJiji), SecurityMiddleware.sanitize, jijiController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/jijis/:id Get Jiji
   * @apiDescription Get jiji information
   * @apiVersion 1.0.0
   * @apiName GetJiji
   * @apiGroup Jiji
   * @apiPermission jiji
   *
   * @apiHeader {String} Athorization  Jiji's access token
   *
   * @apiSuccess {String}  id         Jiji's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated jijis can access the data
   * @apiError (Forbidden 403)    Forbidden    Only jiji with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Jiji does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getJiji), jijiController.get)



  /**
   * @api {put} v1/jijis/:id Replace Jiji
   * @apiDescription Replace the whole jiji document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceJiji
   * @apiGroup Jiji
   * @apiPermission jiji
   *
   * @apiHeader {String} Athorization  Jiji's access token
   *
   * @apiParam  {String=jiji,admin}  [role]    Jiji's role
   * (You must be an admin to change the jiji's role)
   *
   * @apiSuccess {String}  id         Jiji's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated jijis can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only jiji with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Jiji does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceJiji), SecurityMiddleware.sanitize, jijiController.update)



  /**
   * @api {patch} v1/jijis/:id Update Jiji
   * @apiDescription Update some fields of a jiji document
   * @apiVersion 1.0.0
   * @apiName UpdateJiji
   * @apiGroup Jiji
   * @apiPermission jiji
   *
   * @apiHeader {String} Authorization  Jiji's access token
   *
   * @apiParam  {String=jiji,admin}  [role]    Jiji's role
   * (You must be an admin to change the jiji's role)
   *
   * @apiSuccess {String}  id         Jiji's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated jijis can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only jiji with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Jiji does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateJiji), SecurityMiddleware.sanitize, jijiController.update)



  /**
   * @api {patch} v1/jijis/:id Delete Jiji
   * @apiDescription Delete a jiji
   * @apiVersion 1.0.0
   * @apiName DeleteJiji
   * @apiGroup Jiji
   * @apiPermission jiji
   *
   * @apiHeader {String} Athorization  Jiji's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated jijis can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only jiji with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Jiji does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, jijiController.remove);


export { router };
