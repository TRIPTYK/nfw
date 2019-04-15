"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = require("express-validation");
const express_1 = require("express");
const auth_controller_1 = require("./../../controllers/auth.controller");
const auth_validation_1 = require("./../../validations/auth.validation");
const auth_middleware_1 = require("./../../middlewares/auth.middleware");
const security_middleware_1 = require("../../middlewares/security.middleware");
const user_middleware_1 = require("../../middlewares/user.middleware");
const router = express_1.Router();
exports.router = router;
const authController = new auth_controller_1.AuthController();
const userMiddleware = new user_middleware_1.UserMiddleware(); /* Todo injecter comme dépendance */
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
    .post(userMiddleware.deserialize, validate(auth_validation_1.register), security_middleware_1.SecurityMiddleware.sanitize, authController.register);
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
    .post(userMiddleware.deserialize, validate(auth_validation_1.login), security_middleware_1.SecurityMiddleware.sanitize, authController.login);
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
    .post(validate(auth_validation_1.refresh), authController.refresh);
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
    .post(validate(auth_validation_1.oAuth), auth_middleware_1.oAuth('facebook'), authController.oAuth);
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
    .post(validate(auth_validation_1.oAuth), auth_middleware_1.oAuth('google'), authController.oAuth);