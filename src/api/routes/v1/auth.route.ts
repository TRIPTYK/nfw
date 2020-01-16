import {Router} from "express";
import { IRouter } from ".";
import { UserMiddleware } from "../../middlewares/user.middleware";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import { AuthController } from "../../controllers/auth.controller";
import { refresh, login, register } from "../../validations/auth.validation";
import AuthMiddleware from "../../middlewares/auth.middleware";

export default class AuthRouter implements IRouter {
    private router: Router;

    private controller: AuthController;
    private middleware: UserMiddleware;

    constructor() {
        this.router = Router();

        this.controller = new AuthController();
        this.middleware = new UserMiddleware();
    }

    public setup() {
        this.router.route("/register")
            .post(
                this.middleware.deserialize(),
                this.middleware.handleValidation(register),
                SecurityMiddleware.sanitize,
                this.controller.method("register")
            );

        this.router.route("/login")
            .post(
                this.middleware.handleValidation(login),
                SecurityMiddleware.sanitize,
                this.controller.method("login")
            );

        this.router.route("/refresh-token")
            .post(
                this.middleware.handleValidation(refresh),
                this.controller.method("refresh")
            );

        this.router.route("/facebook")
            .get(
                AuthMiddleware.oAuth("facebook", ["public_profile", "email"])
            );

        this.router.route("/facebook/callback")
            .get(
                AuthMiddleware.oAuth("facebook"),
                this.controller.method("oAuth")
            );

        this.router.route("/google")
            .get(
                AuthMiddleware.oAuth("google", ["profile", "email"])
            );

        this.router.route("/google/callback")
            .get(
                AuthMiddleware.oAuth("google"),
                this.controller.method("oAuth")
            );

        this.router.route("/refresh-oauth/:service")
            .get(
                this.middleware.handleValidation(refresh),
                AuthMiddleware.oAuth("google"),
                this.controller.method("refreshOAuth")
            );

        return this.router;
    }
}
