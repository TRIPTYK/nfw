import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import {Request , Response} from "express";
import {UserSerializer} from "../serializers/user.serializer";
import {userRelations} from "../enums/json-api/user.enum";
import { Get, Post, Patch, Put, Delete, RouteMiddleware, MethodMiddleware, JsonApiControllers } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import SecurityMiddleware from "../middlewares/security.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { createUser, updateUser } from "../validations/user.validation";
import DeserializeRelationsMiddleware from "../middlewares/deserialize-relations.middleware";
import UserSchema from "../serializers/schemas/user.serializer.schema";
import { autoInjectable } from "tsyringe";
import PaginationQueryParams from "../../core/types/jsonapi";
import { User } from "../models/user.model";
import JsonApiController from "../../core/controllers/json-api.controller";

@JsonApiControllers("users",User)
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@RouteMiddleware(DeserializeMiddleware, UserSerializer)
@RouteMiddleware(SecurityMiddleware)
@autoInjectable()
export default class UserController extends JsonApiController<User> {
    @Get("/profile")
    @MethodMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
    public profile(req: Request): Promise<any> {
        return this.serializer.serialize(req.user as User);
    }

    @Get("/:id")
    public async get(req: Request): Promise<void> {
        const user = await this.repository.jsonApiFindOne(req, req.params.id, userRelations);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return this.serializer.serialize(user);
    }

    @Post("/")
    @MethodMiddleware(DeserializeRelationsMiddleware, { schema : UserSchema.schema })
    @MethodMiddleware(ValidationMiddleware, { schema: createUser })
    public async create(req: Request, res: Response): Promise<any> {
        const user = this.repository.create(req.body);
        const saved = await this.repository.save(user);
        res.status(HttpStatus.CREATED);
        return this.serializer.serialize(saved);
    }

    @Patch("/:id")
    @Put("/:id")
    @MethodMiddleware(ValidationMiddleware, { schema: updateUser })
    public async update(req: Request): Promise<any> {
        if (!req.body.password) {
            delete req.body.password;
        }

        let saved = await this.repository.preload({
            ...req.body, ...{id : req.params.id}
        });

        if (saved === undefined) {
            throw Boom.notFound("User not found");
        }

        saved = await this.repository.save(saved);

        return this.serializer.serialize(saved);
    }

    @Get("/")
    public async list(req: Request): Promise<any> {
        const [users, totalUsers] = await this.repository.jsonApiRequest({
            includes : req.query.include ? (req.query.include as string).split(",") : null,
            sort : req.query.sort ? (req.query.sort as string).split(",") : null,
            fields : req.query.fields as any ?? null,
            page: req.query.page as any ?? null
        }).getManyAndCount();

        if (req.query.page) {
            const page: PaginationQueryParams = req.query.page as any;

            return new UserSerializer({
                pagination: {
                    page: page.number,
                    size: page.size,
                    total: totalUsers,
                    url: req.url
                }
            }).serialize(users);
        }

        return this.serializer
            .serialize(users);
    }

    @Get("/:id/:relation")
    public async fetchRelated(req: Request): Promise<any> {
        return this.repository.fetchRelated(req, this.serializer);
    }

    @Post("/:id/relationships/:relation")
    public async addRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Patch("/:id/relationships/:relation")
    public async updateRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:id/relationships/:relation")
    public async removeRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:id")
    public async remove(req: Request, res: Response): Promise<any> {
        const user = await this.repository.findOne(req.params.id);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
