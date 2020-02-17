import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import {Request , Response} from "express";
import {UserSerializer} from "../serializers/user.serializer";
import {userRelations} from "../enums/json-api/user.enum";
import { UserRepository } from "../repositories/user.repository";
import { Controller, Get, Post, Patch, Put, Delete, RouteMiddleware, MethodMiddleware } from "../decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import SecurityMiddleware from "../middlewares/security.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { createUser, updateUser } from "../validations/user.validation";
import { repository } from "../decorators/repository.decorator";
import DeserializeRelationsMiddleware from "../middlewares/deserialize-relations.middleware";
import UserSchema from "../serializers/schemas/user.serializer.schema";

@Controller("users")
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@RouteMiddleware(DeserializeMiddleware, UserSerializer)
@RouteMiddleware(SecurityMiddleware)
export default class UserController {
    @repository(UserRepository) private repository: UserRepository;

    @Get()
    @MethodMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
    public profile(req: Request, res: Response) {
        return new UserSerializer().serialize(req.user);
    }

    @Get("/:userId")
    public async get(req: Request, res: Response, next) {
        const user = await this.repository.jsonApiFindOne(req, req.params.userId, userRelations);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return new UserSerializer().serialize(user);
    }

    @Post("/")
    @MethodMiddleware(DeserializeRelationsMiddleware, {serializer : UserSerializer})
    @MethodMiddleware(ValidationMiddleware, { schema: createUser })
    public async create(req: Request, res: Response, next) {
        const user = this.repository.create(req.body);
        await this.repository.insert(user);
        res.status(HttpStatus.CREATED);
        return new UserSerializer().serialize(user);
    }

    @Patch("/:userId")
    @Put("/:userId")
    @MethodMiddleware(ValidationMiddleware, { schema: updateUser })
    public async update(req: Request, res: Response, next) {
        if (!req.body.password) {
            delete req.body.password;
        }

        const saved = await this.repository.preload({
            ...req.body, ...{id : req.params.userId}
        } as any);

        if (saved === undefined) {
            throw Boom.notFound("User not found");
        }

        return new UserSerializer().serialize(saved);
    }

    @Get("/")
    public async list(req: Request, res: Response, next) {
        const [users, totalUsers] = await this.repository.jsonApiRequest(req.query, userRelations).getManyAndCount();

        if (req.query.page) {
            return new UserSerializer({
                pagination: {
                    page: parseInt(req.query.page.number, 10),
                    size: parseInt(req.query.page.size, 10),
                    total: totalUsers,
                    url: req.url
                }
            }).serialize(users);
        }

        return new UserSerializer()
            .serialize(users);
    }

    @Get("/:id/:relation")
    public async fetchRelated(req: Request, res: Response, next) {
        return this.repository.fetchRelated(req, UserSerializer);
    }

    @Get("/:id/relationships/:relation")
    public async fetchRelationships(req: Request, res: Response, next) {
        return this.repository.fetchRelationshipsFromRequest(req, UserSerializer);
    }

    @Post("/:id/relationships/:relation")
    public async addRelationships(req: Request, res: Response, next) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Patch("/:id/relationships/:relation")
    public async updateRelationships(req: Request, res: Response, next) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:id/relationships/:relation")
    public async removeRelationships(req: Request, res: Response, next) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:userId")
    public async remove(req: Request, res: Response, next) {
        const user = await this.repository.findOne(req.params.userId);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
