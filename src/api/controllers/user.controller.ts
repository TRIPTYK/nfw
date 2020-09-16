import {Request,Response} from "express";
import { Get, JsonApiController, JsonApiMethodMiddleware, RouteMiddleware } from "../../core/decorators/controller.decorator";
import { autoInjectable, singleton } from "tsyringe";
import { User } from "../models/user.model";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import DeserializeMiddleware from "../../core/middlewares/deserialize.middleware";
import { UserSerializer } from "../serializers/user.serializer";

@JsonApiController(User)
@singleton()
@autoInjectable()
@RouteMiddleware(AuthMiddleware,[Roles.Admin])
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    @JsonApiMethodMiddleware(AuthMiddleware,[Roles.Admin])
    @JsonApiMethodMiddleware(DeserializeMiddleware,{ serializer: UserSerializer, schema: "default"})
    public profile(req: Request): any {
        return req.user;
    }

    public async remove(req: Request,res: Response) {
        return super.remove(req,res);
    }
}
