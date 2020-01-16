import {Router} from "express";
import {DocumentController} from "../../controllers/document.controller";
import {DocumentMiddleware} from "../../middlewares/document.middleware";
import {roles} from "../../enums/role.enum";
import {relationships} from "@triptyk/nfw-core";
import {deleteDocument, getDocument, updateDocument, validateFile} from "../../validations/document.validation";
import { MulterService, StorageType } from "../../services/multer.service";
import {ServiceContainer} from "../../services/service-container.service";
import { IRouter } from ".";
import * as Multer from "multer";
import AuthMiddleware from "../../middlewares/auth.middleware";

export default class DocumentRouter implements IRouter {
    private router: Router;

    private multerService: MulterService;
    private multer: Multer.Instance;

    private controller: DocumentController;
    private middleware: DocumentMiddleware;

    constructor() {
        this.router = Router();

        this.multerService = ServiceContainer.getService("upload") as MulterService;
        this.multer = this.multerService.makeMulter(
            StorageType.DISK, "./dist/uploads/documents",
            validateFile,
            10480
        );

        this.controller = new DocumentController();
        this.middleware = new DocumentMiddleware();
    }

    public setup() {
        this.router.param("documentId", this.middleware.deserialize());

        this.router.route("/")
            .get(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.controller.method("list")
            )
            .post(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.multer.single("document"),
                this.middleware.resize,
                this.controller.method("create")
            );

        this.router.route("/:documentId")
            .get(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.middleware.handleValidation(getDocument),
                this.controller.method("get")
            )
            .patch(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.middleware.handleValidation(updateDocument),
                this.multer.single("document"),
                this.middleware.resize,
                this.controller.method("update")
            )
            .put(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.middleware.handleValidation(updateDocument),
                this.multer.single("document"),
                this.middleware.resize,
                this.controller.method("update")
            )
            .delete(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.middleware.handleValidation(deleteDocument),
                this.controller.method("remove")
            );

        this.router.route("/:id/:relation")
            .get(
                this.middleware.handleValidation(relationships),
                this.controller.method("fetchRelated")
            );

        this.router.route("/:id/relationships/:relation")
            .get(
                this.middleware.handleValidation(relationships),
                this.controller.method("fetchRelationships")
            )
            .post(
                this.middleware.deserialize({ withRelationships : false }),
                this.middleware.handleValidation(relationships),
                this.controller.method("addRelationships")
            )
            .patch(
                this.middleware.deserialize({ withRelationships : false }),
                this.middleware.handleValidation(relationships),
                this.controller.method("updateRelationships")
            )
            .delete(
                this.middleware.deserialize({ withRelationships : false }),
                this.middleware.handleValidation(relationships),
                this.controller.method("removeRelationships")
            );

        return this.router;
    }
}
