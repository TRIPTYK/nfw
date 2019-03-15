import * as validate from "express-validation";

import { Router } from "express";
import { KickerController } from "./../../controllers/kicker.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/kicker.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { KickerMiddleware } from "./../../middlewares/kicker.middleware";

const router = Router();

const kickerController = new KickerController();
const kickerMiddleware = new KickerMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/kickers List Kickers
   * @apiDescription Get a list of kickers
   * @apiVersion 1.0.0
   * @apiName ListKickers
   * @apiGroup Kicker
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Kicker's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Kickers per page
   * @apiParam  {String=kicker,admin}  [role]       Kicker's role
   *
   * @apiSuccess {Object[]} kickers List of kickers.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated kickers can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listKickers), kickerController.list)



  /**
   * @api {post} v1/kickers Create Kicker
   * @apiDescription Create a new kicker
   * @apiVersion 1.0.0
   * @apiName CreateKicker
   * @apiGroup Kicker
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Kicker's access token
   *
   *
   * @apiSuccess (Created 201) {String}  kicker.id         Kicker's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated kickers can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createKicker), SecurityMiddleware.sanitize, kickerController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/kickers/:id Get Kicker
   * @apiDescription Get kicker information
   * @apiVersion 1.0.0
   * @apiName GetKicker
   * @apiGroup Kicker
   * @apiPermission kicker
   *
   * @apiHeader {String} Athorization  Kicker's access token
   *
   * @apiSuccess {String}  id         Kicker's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated kickers can access the data
   * @apiError (Forbidden 403)    Forbidden    Only kicker with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Kicker does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getKicker), kickerController.get)



  /**
   * @api {put} v1/kickers/:id Replace Kicker
   * @apiDescription Replace the whole kicker document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceKicker
   * @apiGroup Kicker
   * @apiPermission kicker
   *
   * @apiHeader {String} Athorization  Kicker's access token
   *
   * @apiParam  {String=kicker,admin}  [role]    Kicker's role
   * (You must be an admin to change the kicker's role)
   *
   * @apiSuccess {String}  id         Kicker's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated kickers can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only kicker with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Kicker does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceKicker), SecurityMiddleware.sanitize, kickerController.update)



  /**
   * @api {patch} v1/kickers/:id Update Kicker
   * @apiDescription Update some fields of a kicker document
   * @apiVersion 1.0.0
   * @apiName UpdateKicker
   * @apiGroup Kicker
   * @apiPermission kicker
   *
   * @apiHeader {String} Authorization  Kicker's access token
   *
   * @apiParam  {String=kicker,admin}  [role]    Kicker's role
   * (You must be an admin to change the kicker's role)
   *
   * @apiSuccess {String}  id         Kicker's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated kickers can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only kicker with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Kicker does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateKicker), SecurityMiddleware.sanitize, kickerController.update)



  /**
   * @api {patch} v1/kickers/:id Delete Kicker
   * @apiDescription Delete a kicker
   * @apiVersion 1.0.0
   * @apiName DeleteKicker
   * @apiGroup Kicker
   * @apiPermission kicker
   *
   * @apiHeader {String} Athorization  Kicker's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated kickers can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only kicker with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Kicker does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, kickerController.remove);


export { router };
