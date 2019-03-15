import * as validate from "express-validation";

import { Router } from "express";
import { Colde_oneController } from "./../../controllers/colde_one.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/colde_one.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { Colde_oneMiddleware } from "./../../middlewares/colde_one.middleware";

const router = Router();

const colde_oneController = new Colde_oneController();
const colde_oneMiddleware = new Colde_oneMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/colde_ones List Colde_ones
   * @apiDescription Get a list of colde_ones
   * @apiVersion 1.0.0
   * @apiName ListColde_ones
   * @apiGroup Colde_one
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Colde_one's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Colde_ones per page
   * @apiParam  {String=colde_one,admin}  [role]       Colde_one's role
   *
   * @apiSuccess {Object[]} colde_ones List of colde_ones.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated colde_ones can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listColde_ones), colde_oneController.list)



  /**
   * @api {post} v1/colde_ones Create Colde_one
   * @apiDescription Create a new colde_one
   * @apiVersion 1.0.0
   * @apiName CreateColde_one
   * @apiGroup Colde_one
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Colde_one's access token
   *
   *
   * @apiSuccess (Created 201) {String}  colde_one.id         Colde_one's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated colde_ones can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createColde_one), SecurityMiddleware.sanitize, colde_oneController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/colde_ones/:id Get Colde_one
   * @apiDescription Get colde_one information
   * @apiVersion 1.0.0
   * @apiName GetColde_one
   * @apiGroup Colde_one
   * @apiPermission colde_one
   *
   * @apiHeader {String} Athorization  Colde_one's access token
   *
   * @apiSuccess {String}  id         Colde_one's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated colde_ones can access the data
   * @apiError (Forbidden 403)    Forbidden    Only colde_one with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Colde_one does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getColde_one), colde_oneController.get)



  /**
   * @api {put} v1/colde_ones/:id Replace Colde_one
   * @apiDescription Replace the whole colde_one document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceColde_one
   * @apiGroup Colde_one
   * @apiPermission colde_one
   *
   * @apiHeader {String} Athorization  Colde_one's access token
   *
   * @apiParam  {String=colde_one,admin}  [role]    Colde_one's role
   * (You must be an admin to change the colde_one's role)
   *
   * @apiSuccess {String}  id         Colde_one's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated colde_ones can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only colde_one with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Colde_one does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceColde_one), SecurityMiddleware.sanitize, colde_oneController.update)



  /**
   * @api {patch} v1/colde_ones/:id Update Colde_one
   * @apiDescription Update some fields of a colde_one document
   * @apiVersion 1.0.0
   * @apiName UpdateColde_one
   * @apiGroup Colde_one
   * @apiPermission colde_one
   *
   * @apiHeader {String} Authorization  Colde_one's access token
   *
   * @apiParam  {String=colde_one,admin}  [role]    Colde_one's role
   * (You must be an admin to change the colde_one's role)
   *
   * @apiSuccess {String}  id         Colde_one's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated colde_ones can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only colde_one with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Colde_one does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateColde_one), SecurityMiddleware.sanitize, colde_oneController.update)



  /**
   * @api {patch} v1/colde_ones/:id Delete Colde_one
   * @apiDescription Delete a colde_one
   * @apiVersion 1.0.0
   * @apiName DeleteColde_one
   * @apiGroup Colde_one
   * @apiPermission colde_one
   *
   * @apiHeader {String} Athorization  Colde_one's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated colde_ones can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only colde_one with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Colde_one does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, colde_oneController.remove);


export { router };
