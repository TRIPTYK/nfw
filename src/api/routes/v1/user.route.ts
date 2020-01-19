import {Router} from "express";
import {Roles} from "../../enums/role.enum";
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
                AuthMiddleware.authorize([Roles.Admin]),
                this.controller.method("list")
            )
            .post(
                AuthMiddleware.authorize([Roles.Admin]),
                this.middleware.deserialize(),
                this.middleware.handleValidation(createUser),
                SecurityMiddleware.sanitize,
                this.controller.method("create")
            );

        this.router.route("/profile")
            .get(
                AuthMiddleware.authorize([Roles.Admin, Roles.User]),
                this.controller.method("loggedIn")
            );

        this.router.route("/changePassword")
            .post(
                AuthMiddleware.authorize([Roles.Admin, Roles.User]),
                this.middleware.deserialize({ withRelationships : false }),
                this.middleware.handleValidation(changePassword),
                this.controller.method("changePassword")
            );

        this.router.route("/:userId")
            .get(
                AuthMiddleware.authorize([Roles.Admin]),
                this.middleware.handleValidation(getUser),
                this.controller.method("get")
            )
            .patch(
                AuthMiddleware.authorize([Roles.Admin]),
                this.middleware.deserialize({nullEqualsUndefined : true}),
                this.middleware.handleValidation(updateUser),
                SecurityMiddleware.sanitize,
                this.controller.method("update")
            )
            .put(
                AuthMiddleware.authorize([Roles.Admin]),
                this.middleware.deserialize({nullEqualsUndefined : true}),
                this.middleware.handleValidation(createUser),
                SecurityMiddleware.sanitize,
                this.controller.method("update")
            )
            .delete(
                AuthMiddleware.authorize([Roles.Admin]),
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
