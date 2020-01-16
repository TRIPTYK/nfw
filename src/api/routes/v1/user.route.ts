import {Router} from "express";
import {roles} from "../../enums/role.enum";
import {relationships} from "@triptyk/nfw-core";
import { IRouter } from ".";
import { UserController } from "../../controllers/user.controller";
import { UserMiddleware } from "../../middlewares/user.middleware";
import { createUser, changePassword, getUser, updateUser } from "../../validations/user.validation";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import AuthMiddleware from "../../middlewares/auth.middleware";

export default class UserRouter implements IRouter {
    private router: Router;

    private controller: UserController;
    private middleware: UserMiddleware;

    constructor() {
        this.router = Router();

        this.controller = new UserController();
        this.middleware = new UserMiddleware();
    }

    public setup() {
        this.router.route("/")
            .get(
                AuthMiddleware.authorize([roles.admin]),
                this.controller.method("list")
            )
            .post(
                AuthMiddleware.authorize([roles.admin]),
                this.middleware.deserialize(),
                this.middleware.handleValidation(createUser),
                SecurityMiddleware.sanitize,
                this.controller.method("create")
            );

        this.router.route("/profile")
            .get(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.controller.method("loggedIn")
            );

        this.router.route("/changePassword")
            .post(
                AuthMiddleware.authorize([roles.admin, roles.user]),
                this.middleware.deserialize({ withRelationships : false }),
                this.middleware.handleValidation(changePassword),
                this.controller.method("changePassword")
            );

        this.router.route("/:userId")
            .get(
                AuthMiddleware.authorize([roles.admin]),
                this.middleware.handleValidation(getUser),
                this.controller.method("get")
            )
            .patch(
                AuthMiddleware.authorize([roles.admin]),
                this.middleware.deserialize({nullEqualsUndefined : true}),
                this.middleware.handleValidation(updateUser),
                SecurityMiddleware.sanitize,
                this.controller.method("update")
            )
            .put(
                AuthMiddleware.authorize([roles.admin]),
                this.middleware.deserialize({nullEqualsUndefined : true}),
                this.middleware.handleValidation(createUser),
                SecurityMiddleware.sanitize,
                this.controller.method("update")
            )
            .delete(
                AuthMiddleware.authorize([roles.admin]),
                this.middleware.handleValidation(getUser),
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
