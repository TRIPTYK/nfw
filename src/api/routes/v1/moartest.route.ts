import * as validate from "express-validation";

import { Router } from "express";
import { MoartestController } from "./../../controllers/moartest.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/moartest.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { MoartestMiddleware } from "./../../middlewares/moartest.middleware";

const router = Router();

const moartestController = new MoartestController();
const moartestMiddleware = new MoartestMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/moartests List Moartests
   * @apiDescription Get a list of moartests
   * @apiVersion 1.0.0
   * @apiName ListMoartests
   * @apiGroup Moartest
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Moartest's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Moartests per page
   * @apiParam  {String=moartest,admin}  [role]       Moartest's role
   *
   * @apiSuccess {Object[]} moartests List of moartests.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated moartests can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listMoartests), moartestController.list)



  /**
   * @api {post} v1/moartests Create Moartest
   * @apiDescription Create a new moartest
   * @apiVersion 1.0.0
   * @apiName CreateMoartest
   * @apiGroup Moartest
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Moartest's access token
   *
   *
   * @apiSuccess (Created 201) {String}  moartest.id         Moartest's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated moartests can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createMoartest), SecurityMiddleware.sanitize, moartestController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/moartests/:id Get Moartest
   * @apiDescription Get moartest information
   * @apiVersion 1.0.0
   * @apiName GetMoartest
   * @apiGroup Moartest
   * @apiPermission moartest
   *
   * @apiHeader {String} Athorization  Moartest's access token
   *
   * @apiSuccess {String}  id         Moartest's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated moartests can access the data
   * @apiError (Forbidden 403)    Forbidden    Only moartest with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Moartest does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getMoartest), moartestController.get)



  /**
   * @api {put} v1/moartests/:id Replace Moartest
   * @apiDescription Replace the whole moartest document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceMoartest
   * @apiGroup Moartest
   * @apiPermission moartest
   *
   * @apiHeader {String} Athorization  Moartest's access token
   *
   * @apiParam  {String=moartest,admin}  [role]    Moartest's role
   * (You must be an admin to change the moartest's role)
   *
   * @apiSuccess {String}  id         Moartest's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated moartests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only moartest with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Moartest does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceMoartest), SecurityMiddleware.sanitize, moartestController.update)



  /**
   * @api {patch} v1/moartests/:id Update Moartest
   * @apiDescription Update some fields of a moartest document
   * @apiVersion 1.0.0
   * @apiName UpdateMoartest
   * @apiGroup Moartest
   * @apiPermission moartest
   *
   * @apiHeader {String} Authorization  Moartest's access token
   *
   * @apiParam  {String=moartest,admin}  [role]    Moartest's role
   * (You must be an admin to change the moartest's role)
   *
   * @apiSuccess {String}  id         Moartest's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated moartests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only moartest with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Moartest does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateMoartest), SecurityMiddleware.sanitize, moartestController.update)



  /**
   * @api {patch} v1/moartests/:id Delete Moartest
   * @apiDescription Delete a moartest
   * @apiVersion 1.0.0
   * @apiName DeleteMoartest
   * @apiGroup Moartest
   * @apiPermission moartest
   *
   * @apiHeader {String} Athorization  Moartest's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated moartests can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only moartest with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Moartest does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, moartestController.remove);


export { router };
