import * as validate from "express-validation";

import { Router } from "express";
import { PotatoController } from "./../../controllers/potato.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/potato.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { PotatoMiddleware } from "./../../middlewares/potato.middleware";

const router = Router();

const potatoController = new PotatoController();
const potatoMiddleware = new PotatoMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/potatos List Potatos
   * @apiDescription Get a list of potatos
   * @apiVersion 1.0.0
   * @apiName ListPotatos
   * @apiGroup Potato
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Potato's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Potatos per page
   * @apiParam  {String=potato,admin}  [role]       Potato's role
   *
   * @apiSuccess {Object[]} potatos List of potatos.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated potatos can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listPotatos), potatoController.list)



  /**
   * @api {post} v1/potatos Create Potato
   * @apiDescription Create a new potato
   * @apiVersion 1.0.0
   * @apiName CreatePotato
   * @apiGroup Potato
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Potato's access token
   *
   *
   * @apiSuccess (Created 201) {String}  potato.id         Potato's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated potatos can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createPotato), SecurityMiddleware.sanitize, potatoController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/potatos/:id Get Potato
   * @apiDescription Get potato information
   * @apiVersion 1.0.0
   * @apiName GetPotato
   * @apiGroup Potato
   * @apiPermission potato
   *
   * @apiHeader {String} Athorization  Potato's access token
   *
   * @apiSuccess {String}  id         Potato's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated potatos can access the data
   * @apiError (Forbidden 403)    Forbidden    Only potato with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Potato does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getPotato), potatoController.get)



  /**
   * @api {put} v1/potatos/:id Replace Potato
   * @apiDescription Replace the whole potato document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplacePotato
   * @apiGroup Potato
   * @apiPermission potato
   *
   * @apiHeader {String} Athorization  Potato's access token
   *
   * @apiParam  {String=potato,admin}  [role]    Potato's role
   * (You must be an admin to change the potato's role)
   *
   * @apiSuccess {String}  id         Potato's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated potatos can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only potato with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Potato does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replacePotato), SecurityMiddleware.sanitize, potatoController.update)



  /**
   * @api {patch} v1/potatos/:id Update Potato
   * @apiDescription Update some fields of a potato document
   * @apiVersion 1.0.0
   * @apiName UpdatePotato
   * @apiGroup Potato
   * @apiPermission potato
   *
   * @apiHeader {String} Authorization  Potato's access token
   *
   * @apiParam  {String=potato,admin}  [role]    Potato's role
   * (You must be an admin to change the potato's role)
   *
   * @apiSuccess {String}  id         Potato's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated potatos can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only potato with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Potato does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updatePotato), SecurityMiddleware.sanitize, potatoController.update)



  /**
   * @api {patch} v1/potatos/:id Delete Potato
   * @apiDescription Delete a potato
   * @apiVersion 1.0.0
   * @apiName DeletePotato
   * @apiGroup Potato
   * @apiPermission potato
   *
   * @apiHeader {String} Athorization  Potato's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated potatos can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only potato with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Potato does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, potatoController.remove);


export { router };
