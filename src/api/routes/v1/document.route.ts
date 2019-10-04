import {Router} from "express";
import {DocumentController} from "../../controllers/document.controller";
import {authorize} from "../../middlewares/auth.middleware";
import {set as Multer} from "./../../../config/multer.config";
import {DocumentMiddleware} from "../../middlewares/document.middleware";
import {roles} from "../../enums/role.enum";
import {relationships} from "@triptyk/nfw-core";
import {deleteDocument, getDocument, updateDocument} from "../../validations/document.validation";


const router = Router();
const upload = Multer();

const documentController = new DocumentController();
const documentMiddleware = new DocumentMiddleware();

/**
 * Deserialize document when API with userId route parameter is hit
 */
router.param('documentId', documentMiddleware.deserialize());

router
    .route('/')
    .get(authorize([roles.admin, roles.user]), documentController.method('list'))
    .post(authorize([roles.admin]), upload.single('document'), documentMiddleware.resize, documentController.method('create'));

router
    .route('/:documentId')
    .get(authorize(), documentMiddleware.handleValidation(getDocument), documentController.method('get'))
    .patch(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(updateDocument), upload.single('document'), documentMiddleware.resize, documentController.method('update'))
    .put(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(updateDocument), upload.single('document'), documentMiddleware.resize, documentController.method('update'))
    .delete(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(deleteDocument), documentController.method('remove'));

router.route('/:id/:relation')
    .get(documentMiddleware.handleValidation(relationships),documentController.method('fetchRelated'));

router.route('/:id/relationships/:relation')
    .get( documentMiddleware.handleValidation(relationships), documentController.method('fetchRelationships'))
    .post( documentMiddleware.deserialize({ withRelationships : false }),documentMiddleware.handleValidation(relationships), documentController.method('addRelationships'))
    .patch( documentMiddleware.deserialize({ withRelationships : false }),documentMiddleware.handleValidation(relationships), documentController.method('updateRelationships'))
    .delete( documentMiddleware.deserialize({ withRelationships : false }),documentMiddleware.handleValidation(relationships), documentController.method('removeRelationships'));


export {router};
