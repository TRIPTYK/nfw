import {
    BaseJsonApiController,
    Get,
    JsonApiController,
    JsonApiMethodMiddleware
} from "@triptyk/nfw-core";
import { Request } from "express";
import { autoInjectable } from "tsyringe";
import {
    AuthMiddleware,
    AuthMiddlewareArgs
} from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

@JsonApiController(User)
@autoInjectable()
export class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    @JsonApiMethodMiddleware<AuthMiddlewareArgs>(AuthMiddleware)
    public profile(req: Request): any {
        return req.user;
    }
}
