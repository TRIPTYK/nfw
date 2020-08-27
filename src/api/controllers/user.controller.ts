import {Request } from "express";
import { Get, JsonApiController } from "../../core/decorators/controller.decorator";
import { autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import BaseJsonApiController from "../../core/controllers/json-api.controller";

@JsonApiController(User)
@autoInjectable()
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    public profile(req: Request): Promise<any> {
        return this.serializer.serialize(req.user as User);
    }
}
