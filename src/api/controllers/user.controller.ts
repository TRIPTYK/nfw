import {
    BaseJsonApiController,
    Get,
    JsonApiController,
    Post
} from "@triptyk/nfw-core";
import { Request } from "express";
import { autoInjectable } from "tsyringe";
import { User } from "../models/user.model";

@JsonApiController(User)
@autoInjectable()
export class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    public profile(req: Request): any {
        return req.user;
    }

    @Post("/")
    public create(req: Request, res): any {
        return super.create(req, res);
    }
}
