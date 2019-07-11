import {Router} from "express";
import {AuthController} from "../../controllers/auth.controller";
import {login, refresh, register} from "../../validations/auth.validation";
import {authorize, oAuth as oAuthLogin} from "./../../middlewares/auth.middleware";
import {SecurityMiddleware} from "../../middlewares/security.middleware";
import {UserMiddleware} from "../../middlewares/user.middleware";

const router = Router();
const authController = new AuthController();
const userMiddleware = new UserMiddleware();  /* Todo injecter comme dépendance */

router
    .route('/register')
    .post(userMiddleware.deserialize(), userMiddleware.handleValidation(register), SecurityMiddleware.sanitize, authController.method('register'));

router
    .route('/login')
    .post(userMiddleware.deserialize(), userMiddleware.handleValidation(login), SecurityMiddleware.sanitize, authController.method('login'));

router
    .route('/refresh-token')
    .post(userMiddleware.handleValidation(refresh), authController.method('refresh'));

router.route('/facebook')
    .get(oAuthLogin('facebook', ['public_profile', 'email']));

router.route('/facebook/callback')
    .get(oAuthLogin('facebook'), authController.method('oAuth'));

router.route('/google')
    .get(oAuthLogin('google', ['profile', 'email']));

router.route('/google/callback')
    .get(oAuthLogin('google'), authController.method('oAuth'));


export {router};
