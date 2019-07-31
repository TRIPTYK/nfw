import {Router} from "express";
import {UserController} from "../../controllers/user.controller";
import {ADMIN, authorize, LOGGED_USER} from "../../middlewares/auth.middleware";
import {UserMiddleware} from "../../middlewares/user.middleware";
import {changePassword, createUser, getUser, updateUser} from "../../validations/user.validation";
import {SecurityMiddleware} from "../../middlewares/security.middleware";
import {relationships} from "../../validations/global.validation";

const router = Router();
const userController = new UserController(); // Todo injecter comme dépendance
const userMiddleware = new UserMiddleware(); // Todo injecter comme dépendance

/**
 * Deserialize user when API with userId route parameter is hit
 */
router.param('userId', userMiddleware.deserialize());

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userMiddleware.load);

router
    .route('/')
    .get(authorize([ADMIN]), userController.method('list'))
    .post(authorize([ADMIN]), userMiddleware.deserialize(), userMiddleware.handleValidation(createUser), SecurityMiddleware.sanitize, userController.method('create'));

router
    .route('/profile')
    .get(authorize([ADMIN, LOGGED_USER]), userController.method('loggedIn'));

router
    .route('/changePassword')
    .post(authorize([ADMIN, LOGGED_USER]), userMiddleware.deserialize({ withRelationships : false }), userMiddleware.handleValidation(changePassword), userController.method('changePassword'));

router
    .route('/:userId')
    .get(authorize([ADMIN]), userMiddleware.handleValidation(getUser), userController.method('get'))
    .patch(authorize([ADMIN]), userMiddleware.deserialize({nullEqualsUndefined : true}), userMiddleware.handleValidation(updateUser), SecurityMiddleware.sanitize, userController.method('update'))
    .put(authorize([ADMIN]), userMiddleware.deserialize({nullEqualsUndefined : true}), userMiddleware.handleValidation(createUser), SecurityMiddleware.sanitize, userController.method('update'))
    .delete(authorize([ADMIN]), userMiddleware.handleValidation(getUser), userController.method('remove'));

router.route('/:id/relationships/:relation')
    .get( userMiddleware.handleValidation(relationships), userController.method('fetchRelationships'))
    .post( userMiddleware.deserialize({ withRelationships : false }),userMiddleware.handleValidation(relationships), userController.method('addRelationships'))
    .patch( userMiddleware.deserialize({ withRelationships : false }),userMiddleware.handleValidation(relationships), userController.method('updateRelationships'))
    .delete( userMiddleware.deserialize({ withRelationships : false }),userMiddleware.handleValidation(relationships), userController.method('removeRelationships'));

export {router};
