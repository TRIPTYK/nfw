import * as validate from "express-validation";

import { Router } from "express";
import { DatetestController } from "./../../controllers/datetest.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/datetest.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { DatetestMiddleware } from "./../../middlewares/datetest.middleware";

const router = Router();

const datetestController = new DatetestController();
const datetestMiddleware = new DatetestMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/datetests List Datetests
   * @apiDescription Get a list of datetests
   * @apiVersion 1.0.0
   * @apiName ListDatetests
   * @apiGroup Datetest
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Datetest's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Datetests per page
   * @apiParam  {String=datetest,admin}  [role]       Datetest's role
   *
   * @apiSuccess {Object[]} datetests List of datetests.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated datetests can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listDatetests), datetestController.list)



  /**
   * @api {post} v1/datetests Create Datetest
   * @apiDescription Create a new datetest
   * @apiVersion 1.0.0
   * @apiName CreateDatetest
   * @apiGroup Datetest
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Datetest's access token
   *
   *
   * @apiSuccess (Created 201) {String}  datetest.id         Datetest's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated datetests can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createDatetest), SecurityMiddleware.sanitize, datetestController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/datetests/:id Get Datetest
   * @apiDescription Get datetest information
   * @apiVersion 1.0.0
   * @apiName GetDatetest
   * @apiGroup Datetest
   * @apiPermission datetest
   *
   * @apiHeader {String} Athorization  Datetest's access token
   *
   * @apiSuccess {String}  id         Datetest's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datetests can access the data
   * @apiError (Forbidden 403)    Forbidden    Only datetest with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Datetest does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getDatetest), datetestController.get)



  /**
   * @api {put} v1/datetests/:id Replace Datetest
   * @apiDescription Replace the whole datetest document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDatetest
   * @apiGroup Datetest
   * @apiPermission datetest
   *
   * @apiHeader {String} Athorization  Datetest's access token
   *
   * @apiParam  {String=datetest,admin}  [role]    Datetest's role
   * (You must be an admin to change the datetest's role)
   *
   * @apiSuccess {String}  id         Datetest's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datetests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only datetest with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Datetest does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceDatetest), SecurityMiddleware.sanitize, datetestController.update)



  /**
   * @api {patch} v1/datetests/:id Update Datetest
   * @apiDescription Update some fields of a datetest document
   * @apiVersion 1.0.0
   * @apiName UpdateDatetest
   * @apiGroup Datetest
   * @apiPermission datetest
   *
   * @apiHeader {String} Authorization  Datetest's access token
   *
   * @apiParam  {String=datetest,admin}  [role]    Datetest's role
   * (You must be an admin to change the datetest's role)
   *
   * @apiSuccess {String}  id         Datetest's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated datetests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only datetest with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Datetest does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateDatetest), SecurityMiddleware.sanitize, datetestController.update)



  /**
   * @api {patch} v1/datetests/:id Delete Datetest
   * @apiDescription Delete a datetest
   * @apiVersion 1.0.0
   * @apiName DeleteDatetest
   * @apiGroup Datetest
   * @apiPermission datetest
   *
   * @apiHeader {String} Athorization  Datetest's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated datetests can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only datetest with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Datetest does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, datetestController.remove);


export { router };
