import * as validate from "express-validation";

import { Router } from "express";
import { BananaController } from "./../../controllers/banana.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/banana.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { BananaMiddleware } from "./../../middlewares/banana.middleware";

const router = Router();

const bananaController = new BananaController();
const bananaMiddleware = new BananaMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/bananas List Bananas
   * @apiDescription Get a list of bananas
   * @apiVersion 1.0.0
   * @apiName ListBananas
   * @apiGroup Banana
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Banana's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Bananas per page
   * @apiParam  {String=banana,admin}  [role]       Banana's role
   *
   * @apiSuccess {Object[]} bananas List of bananas.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated bananas can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listBananas), bananaController.list)



  /**
   * @api {post} v1/bananas Create Banana
   * @apiDescription Create a new banana
   * @apiVersion 1.0.0
   * @apiName CreateBanana
   * @apiGroup Banana
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Banana's access token
   *
   *
   * @apiSuccess (Created 201) {String}  banana.id         Banana's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated bananas can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createBanana), SecurityMiddleware.sanitize, bananaController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/bananas/:id Get Banana
   * @apiDescription Get banana information
   * @apiVersion 1.0.0
   * @apiName GetBanana
   * @apiGroup Banana
   * @apiPermission banana
   *
   * @apiHeader {String} Athorization  Banana's access token
   *
   * @apiSuccess {String}  id         Banana's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananas can access the data
   * @apiError (Forbidden 403)    Forbidden    Only banana with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Banana does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getBanana), bananaController.get)



  /**
   * @api {put} v1/bananas/:id Replace Banana
   * @apiDescription Replace the whole banana document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceBanana
   * @apiGroup Banana
   * @apiPermission banana
   *
   * @apiHeader {String} Athorization  Banana's access token
   *
   * @apiParam  {String=banana,admin}  [role]    Banana's role
   * (You must be an admin to change the banana's role)
   *
   * @apiSuccess {String}  id         Banana's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananas can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only banana with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Banana does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceBanana), SecurityMiddleware.sanitize, bananaController.update)



  /**
   * @api {patch} v1/bananas/:id Update Banana
   * @apiDescription Update some fields of a banana document
   * @apiVersion 1.0.0
   * @apiName UpdateBanana
   * @apiGroup Banana
   * @apiPermission banana
   *
   * @apiHeader {String} Authorization  Banana's access token
   *
   * @apiParam  {String=banana,admin}  [role]    Banana's role
   * (You must be an admin to change the banana's role)
   *
   * @apiSuccess {String}  id         Banana's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bananas can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only banana with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Banana does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateBanana), SecurityMiddleware.sanitize, bananaController.update)



  /**
   * @api {patch} v1/bananas/:id Delete Banana
   * @apiDescription Delete a banana
   * @apiVersion 1.0.0
   * @apiName DeleteBanana
   * @apiGroup Banana
   * @apiPermission banana
   *
   * @apiHeader {String} Athorization  Banana's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated bananas can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only banana with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Banana does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, bananaController.remove);


export { router };
