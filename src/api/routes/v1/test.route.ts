import * as validate from "express-validation";

import { Router } from "express";
import { TestController } from "./../../controllers/test.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/test.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { TestMiddleware } from "./../../middlewares/test.middleware";

const router = Router();

const testController = new TestController();
const testMiddleware = new TestMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/tests List Tests
   * @apiDescription Get a list of tests
   * @apiVersion 1.0.0
   * @apiName ListTests
   * @apiGroup Test
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Tests per page
   * @apiParam  {String=test,admin}  [role]       Test's role
   *
   * @apiSuccess {Object[]} tests List of tests.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated tests can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listTests), testController.list)



  /**
   * @api {post} v1/tests Create Test
   * @apiDescription Create a new test
   * @apiVersion 1.0.0
   * @apiName CreateTest
   * @apiGroup Test
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Test's access token
   *
   *
   * @apiSuccess (Created 201) {String}  test.id         Test's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated tests can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createTest), SecurityMiddleware.sanitize, testController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/tests/:id Get Test
   * @apiDescription Get test information
   * @apiVersion 1.0.0
   * @apiName GetTest
   * @apiGroup Test
   * @apiPermission test
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiSuccess {String}  id         Test's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can access the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getTest), testController.get)



  /**
   * @api {put} v1/tests/:id Replace Test
   * @apiDescription Replace the whole test document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceTest
   * @apiGroup Test
   * @apiPermission test
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiParam  {String=test,admin}  [role]    Test's role
   * (You must be an admin to change the test's role)
   *
   * @apiSuccess {String}  id         Test's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceTest), SecurityMiddleware.sanitize, testController.update)



  /**
   * @api {patch} v1/tests/:id Update Test
   * @apiDescription Update some fields of a test document
   * @apiVersion 1.0.0
   * @apiName UpdateTest
   * @apiGroup Test
   * @apiPermission test
   *
   * @apiHeader {String} Authorization  Test's access token
   *
   * @apiParam  {String=test,admin}  [role]    Test's role
   * (You must be an admin to change the test's role)
   *
   * @apiSuccess {String}  id         Test's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateTest), SecurityMiddleware.sanitize, testController.update)



  /**
   * @api {patch} v1/tests/:id Delete Test
   * @apiDescription Delete a test
   * @apiVersion 1.0.0
   * @apiName DeleteTest
   * @apiGroup Test
   * @apiPermission test
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated tests can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only test with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Test does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, testController.remove);


export { router };
