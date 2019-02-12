import * as validate from "express-validation";

import { Router } from "express";
import { TestController } from "./../../controllers/test.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import { listTests, getTest, createTest, replaceTest, updateTest } from "./../../validations/test.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";

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
   * @apiParam  {String}             [name]       Test's name
   * @apiParam  {String}             [email]      Test's email
   * @apiParam  {String=test,admin}  [role]       Test's role
   *
   * @apiSuccess {Object[]} tests List of tests.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated tests can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */

  .get(authorize([ADMIN]), validate(listTests), testController.list)

  /**
   * @api {post} v1/tests Create Test
   * @apiDescription Create a new test
   * @apiVersion 1.0.0
   * @apiName CreateTest
   * @apiGroup Test
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiParam  {String}             email     Test's email
   * @apiParam  {String{8..16}}     password   Test's password
   * @apiParam  {String{..32}}      [name]     Test's testname
   * @apiParam  {String=test,admin}  [role]    Test's role
   *
   * @apiSuccess (Created 201) {String}  test.id         Test's id
   * @apiSuccess (Created 201) {String}  test.testname   Test's name
   * @apiSuccess (Created 201) {String}  test.email      Test's email
   * @apiSuccess (Created 201) {String}  test.role       Test's role
   * @apiSuccess (Created 201) {String}  test.firstname  Test's firstname
   * @apiSuccess (Created 201) {String}  test.lastname   Test's lastname
   * @apiSuccess (Created 201) {String}  test.picture    Test's picture
   * @apiSuccess (Created 201) {Date}    test.createdAt  Date
   * @apiSuccess (Created 201) {Date}    test.updatedAt  Date
   * @apiSuccess (Created 201) {Date}    test.deletedAt  Date
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated tests can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */

  .post(authorize([ADMIN]), validate(createTest), SecurityMiddleware.sanitize, testController.create);

router
  .route('/:testId')
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
   * @apiSuccess {String}  name       Test's name
   * @apiSuccess {String}  email      Test's email
   * @apiSuccess {String}  role       Test's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can access the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */

  .get(authorize([ADMIN, LOGGED_USER]), validate(getTest), testController.get)

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
   * @apiParam  {String}             email     Test's email
   * @apiParam  {String{6..128}}     password  Test's password
   * @apiParam  {String{..128}}      [name]    Test's name
   * @apiParam  {String=test,admin}  [role]    Test's role
   * (You must be an admin to change the test's role)
   *
   * @apiSuccess {String}  id         Test's id
   * @apiSuccess {String}  name       Test's name
   * @apiSuccess {String}  email      Test's email
   * @apiSuccess {String}  role       Test's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */

  .put(authorize([ADMIN, LOGGED_USER]), validate(replaceTest), SecurityMiddleware.sanitize, testController.update)

  /**
   * @api {patch} v1/tests/:id Update Test
   * @apiDescription Update some fields of a test document
   * @apiVersion 1.0.0
   * @apiName UpdateTest
   * @apiGroup Test
   * @apiPermission test
   *
   * @apiHeader {String} Athorization  Test's access token
   *
   * @apiParam  {String}             email     Test's email
   * @apiParam  {String{6..128}}     password  Test's password
   * @apiParam  {String{..128}}      [name]    Test's name
   * @apiParam  {String=test,admin}  [role]    Test's role
   * (You must be an admin to change the test's role)
   *
   * @apiSuccess {String}  id         Test's id
   * @apiSuccess {String}  name       Test's name
   * @apiSuccess {String}  email      Test's email
   * @apiSuccess {String}  role       Test's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tests can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only test with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Test does not exist
   */

  .patch(authorize([ADMIN, LOGGED_USER]), validate(updateTest), SecurityMiddleware.sanitize, testController.update)

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

  .delete(authorize([ADMIN, LOGGED_USER]), SecurityMiddleware.sanitize, testController.remove);


export { router };