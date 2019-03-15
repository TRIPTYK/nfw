import * as validate from "express-validation";

import { Router } from "express";
import { DateController } from "./../../controllers/date.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/date.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { DateMiddleware } from "./../../middlewares/date.middleware";

const router = Router();

const dateController = new DateController();
const dateMiddleware = new DateMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/dates List Dates
   * @apiDescription Get a list of dates
   * @apiVersion 1.0.0
   * @apiName ListDates
   * @apiGroup Date
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Date's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Dates per page
   * @apiParam  {String=date,admin}  [role]       Date's role
   *
   * @apiSuccess {Object[]} dates List of dates.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated dates can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listDates), dateController.list)



  /**
   * @api {post} v1/dates Create Date
   * @apiDescription Create a new date
   * @apiVersion 1.0.0
   * @apiName CreateDate
   * @apiGroup Date
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Date's access token
   *
   *
   * @apiSuccess (Created 201) {String}  date.id         Date's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated dates can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createDate), SecurityMiddleware.sanitize, dateController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/dates/:id Get Date
   * @apiDescription Get date information
   * @apiVersion 1.0.0
   * @apiName GetDate
   * @apiGroup Date
   * @apiPermission date
   *
   * @apiHeader {String} Athorization  Date's access token
   *
   * @apiSuccess {String}  id         Date's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated dates can access the data
   * @apiError (Forbidden 403)    Forbidden    Only date with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Date does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getDate), dateController.get)



  /**
   * @api {put} v1/dates/:id Replace Date
   * @apiDescription Replace the whole date document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDate
   * @apiGroup Date
   * @apiPermission date
   *
   * @apiHeader {String} Athorization  Date's access token
   *
   * @apiParam  {String=date,admin}  [role]    Date's role
   * (You must be an admin to change the date's role)
   *
   * @apiSuccess {String}  id         Date's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated dates can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only date with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Date does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceDate), SecurityMiddleware.sanitize, dateController.update)



  /**
   * @api {patch} v1/dates/:id Update Date
   * @apiDescription Update some fields of a date document
   * @apiVersion 1.0.0
   * @apiName UpdateDate
   * @apiGroup Date
   * @apiPermission date
   *
   * @apiHeader {String} Authorization  Date's access token
   *
   * @apiParam  {String=date,admin}  [role]    Date's role
   * (You must be an admin to change the date's role)
   *
   * @apiSuccess {String}  id         Date's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated dates can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only date with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Date does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateDate), SecurityMiddleware.sanitize, dateController.update)



  /**
   * @api {patch} v1/dates/:id Delete Date
   * @apiDescription Delete a date
   * @apiVersion 1.0.0
   * @apiName DeleteDate
   * @apiGroup Date
   * @apiPermission date
   *
   * @apiHeader {String} Athorization  Date's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated dates can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only date with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Date does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, dateController.remove);


export { router };
