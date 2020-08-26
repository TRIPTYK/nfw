import {Request } from "express";
import { Get, RouteMiddleware, MethodMiddleware, JsonApiController } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import SecurityMiddleware from "../middlewares/security.middleware";
import { autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import BaseJsonApiController from "../../core/controllers/json-api.controller";

@JsonApiController(User)
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@RouteMiddleware(SecurityMiddleware)
@autoInjectable()
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    @MethodMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
    public profile(req: Request): Promise<any> {
        return this.serializer.serialize(req.user as User);
    }
}
