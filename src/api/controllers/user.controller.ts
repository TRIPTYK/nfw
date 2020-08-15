import {Request , Response} from "express";
import {UserSerializer} from "../serializers/user.serializer";
import { Get, RouteMiddleware, MethodMiddleware, JsonApiController } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import SecurityMiddleware from "../middlewares/security.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { createUser, updateUser } from "../validations/user.validation";
import DeserializeRelationsMiddleware from "../middlewares/deserialize-relations.middleware";
import UserSchema from "../serializers/schemas/user.serializer.schema";
import { autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import BaseJsonApiController from "../../core/controllers/json-api.controller";

@JsonApiController(User)
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@RouteMiddleware(DeserializeMiddleware, UserSerializer)
@RouteMiddleware(SecurityMiddleware)
@autoInjectable()
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    @MethodMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
    public profile(req: Request): Promise<any> {
        return this.serializer.serialize(req.user as User);
    }

    @MethodMiddleware(ValidationMiddleware, { schema: updateUser })
    public async update(req: Request): Promise<any> {
        return super.update(req);
    }

    @MethodMiddleware(DeserializeRelationsMiddleware, { schema : UserSchema.schema })
    @MethodMiddleware(ValidationMiddleware, { schema: createUser })
    public async create(req: Request, res: Response): Promise<any> {
        return super.create(req,res);
    }
}
