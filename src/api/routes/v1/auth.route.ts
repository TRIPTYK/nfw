import * as validate from "express-validation";

import { Router } from "express";
import { AuthController } from "./../../controllers/auth.controller";
import { register, login, oAuth, refresh } from "./../../validations/auth.validation";
import { oAuth as oAuthLogin } from "./../../middlewares/auth.middleware";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import { UserMiddleware } from "../../middlewares/user.middleware";

const router = Router();      
const authController = new AuthController();
const userMiddleware = new UserMiddleware();  /* Todo injecter comme dépendance */

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{8..16}}  password  User's password
 *
 * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time in miliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.username   User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {String}  user.role       User's role
 * @apiSuccess (Created 201) {String}  user.firstname  User's firstname
 * @apiSuccess (Created 201) {String}  user.lastname   User's lastname
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @Error (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router
  .route('/register')
    .post(userMiddleware.deserialize, validate(register), SecurityMiddleware.sanitize, authController.register);

/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email      User's email
 * @apiParam  {String{..16}}  password    User's password
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.username   User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {String}  user.role       User's role
 * @apiSuccess (Created 201) {String}  user.firstname  User's firstname
 * @apiSuccess (Created 201) {String}  user.lastname   User's lastname
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @Error (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @Error (Unauthorized 401)  Unauthorized    Incorrect email or password
 */
router
  .route('/login')
    .post(validate(login), SecurityMiddleware.sanitize, authController.login);
    
/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @Error (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @Error (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router
  .route('/refresh-token')
    .post( validate(refresh), (req, res, next) => { console.log('In'); next(); },  SecurityMiddleware.sanitize, authController.refresh);

/**
 * @api {post} v1/auth/facebook Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @Error (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @Error (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router
  .route('/facebook')
    .post(validate(oAuth), oAuthLogin('facebook'), authController.oAuth);

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @Error (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @Error (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router
  .route('/google')
    .post(validate(oAuth), oAuthLogin('google'), authController.oAuth);

export { router };