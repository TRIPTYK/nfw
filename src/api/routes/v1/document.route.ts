import {Router} from "express";
import {DocumentController} from "../../controllers/document.controller";
import {authorize} from "../../middlewares/auth.middleware";
import {DocumentMiddleware} from "../../middlewares/document.middleware";
import {roles} from "../../enums/role.enum";
import {relationships} from "@triptyk/nfw-core";
import {deleteDocument, getDocument, updateDocument, validateFile} from "../../validations/document.validation";
import { MulterService, StorageType } from "../../services/multer.service";


const router = Router();
const multer = MulterService.makeMulter(StorageType.DISK, "./dist/uploads/documents", validateFile, 10480);

const documentController = new DocumentController();
const documentMiddleware = new DocumentMiddleware();

/**
 * Deserialize document when API with userId route parameter is hit
 */
router.param("documentId", documentMiddleware.deserialize());

router
    .route("/")
    .get(authorize([roles.admin, roles.user]), documentController.method("list"))
    .post(authorize([roles.admin, roles.user]), multer.single("document"),
    documentMiddleware.resize, documentController.method("create"));

router
    .route("/:documentId")
    .get(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(getDocument),
    documentController.method("get"))
    .patch(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(updateDocument),
    multer.single("document"), documentMiddleware.resize, documentController.method("update"))
    .put(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(updateDocument),
    multer.single("document"), documentMiddleware.resize, documentController.method("update"))
    .delete(authorize([roles.admin, roles.user]), documentMiddleware.handleValidation(deleteDocument),
    documentController.method("remove"));

router.route("/:id/:relation")
    .get(documentMiddleware.handleValidation(relationships), documentController.method("fetchRelated"));

router.route("/:id/relationships/:relation")
    .get( documentMiddleware.handleValidation(relationships), documentController.method("fetchRelationships"))
    .post( documentMiddleware.deserialize({ withRelationships : false }),
    documentMiddleware.handleValidation(relationships), documentController.method("addRelationships"))
    .patch( documentMiddleware.deserialize({ withRelationships : false }),
    documentMiddleware.handleValidation(relationships), documentController.method("updateRelationships"))
    .delete( documentMiddleware.deserialize({ withRelationships : false }),
    documentMiddleware.handleValidation(relationships), documentController.method("removeRelationships"));


export {router};
