import * as validate from "express-validation";

import { Router } from "express";
import { BananeController } from "./../../controllers/banane.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/banane.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { BananeMiddleware } from "./../../middlewares/banane.middleware";

const router = Router();

const bananeController = new BananeController();
const bananeMiddleware = new BananeMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/bananes List Bananes
   * @apiDescription Get a list of bananes
   * @apiVersion 1.0.0
   * @apiName ListBananes
   * @apiGroup Banane
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Banane's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Bananes per page
   * @apiParam  {String=banane,admin}  [role]       Banane's role
   *
   * @apiSuccess {Object[]} bananes List of bananes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated bananes can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listBananes), bananeController.list)



  /**
   * @api {post} v1/bananes Create Banane
   * @apiDescription Create a new banane
   * @apiVersion 1.0.0
   * @apiName CreateBanane
   * @apiGroup Banane
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Banane's access token
   *
   *
   * @apiSuccess (Created 201) {String}  banane.id         Banane's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated bananes can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createBanane), SecurityMiddleware.sanitize, bananeController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/bananes/:id Get Banane
   * @apiDescription Get banane information
   * @apiVersion 1.0.0
   * @apiName GetBanane
   * @apiGroup Banane
   * @apiPermission banane
   *
   * @apiHeader {String} Athorization  Banane's access token
   *
   * @apiSuccess {String}  id         Banane's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananes can access the data
   * @apiError (Forbidden 403)    Forbidden    Only banane with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Banane does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getBanane), bananeController.get)



  /**
   * @api {put} v1/bananes/:id Replace Banane
   * @apiDescription Replace the whole banane document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceBanane
   * @apiGroup Banane
   * @apiPermission banane
   *
   * @apiHeader {String} Athorization  Banane's access token
   *
   * @apiParam  {String=banane,admin}  [role]    Banane's role
   * (You must be an admin to change the banane's role)
   *
   * @apiSuccess {String}  id         Banane's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananes can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only banane with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Banane does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceBanane), SecurityMiddleware.sanitize, bananeController.update)



  /**
   * @api {patch} v1/bananes/:id Update Banane
   * @apiDescription Update some fields of a banane document
   * @apiVersion 1.0.0
   * @apiName UpdateBanane
   * @apiGroup Banane
   * @apiPermission banane
   *
   * @apiHeader {String} Authorization  Banane's access token
   *
   * @apiParam  {String=banane,admin}  [role]    Banane's role
   * (You must be an admin to change the banane's role)
   *
   * @apiSuccess {String}  id         Banane's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananes can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only banane with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Banane does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateBanane), SecurityMiddleware.sanitize, bananeController.update)



  /**
   * @api {patch} v1/bananes/:id Delete Banane
   * @apiDescription Delete a banane
   * @apiVersion 1.0.0
   * @apiName DeleteBanane
   * @apiGroup Banane
   * @apiPermission banane
   *
   * @apiHeader {String} Athorization  Banane's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated bananes can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only banane with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Banane does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, bananeController.remove);


export { router };
