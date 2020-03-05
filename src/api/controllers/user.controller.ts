import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import {Request , Response} from "express";
import {UserSerializer} from "../serializers/user.serializer";
import {userRelations} from "../enums/json-api/user.enum";
import { UserRepository } from "../repositories/user.repository";
import { Controller, Get, Post, Patch, Put, Delete, RouteMiddleware, MethodMiddleware } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import SecurityMiddleware from "../middlewares/security.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { createUser, updateUser } from "../validations/user.validation";
import DeserializeRelationsMiddleware from "../middlewares/deserialize-relations.middleware";
import UserSchema from "../serializers/schemas/user.serializer.schema";
import { autoInjectable } from "tsyringe";
import { getCustomRepository } from "typeorm";

@Controller("users")
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@RouteMiddleware(DeserializeMiddleware, UserSerializer)
@RouteMiddleware(SecurityMiddleware)
@autoInjectable()
export default class UserController {
    private repository: UserRepository;

    public constructor( private serializer?: UserSerializer ) {
        this.repository = getCustomRepository(UserRepository);
    }

    @Get()
    @MethodMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
    public profile(req: Request, res: Response) {
        return this.serializer.serialize(req.user);
    }

    @Get("/:userId")
    public async get(req: Request, res: Response) {
        const user = await this.repository.jsonApiFindOne(req, req.params.userId, userRelations);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return this.serializer.serialize(user);
    }

    @Post("/")
    @MethodMiddleware(DeserializeRelationsMiddleware, { schema : UserSchema })
    @MethodMiddleware(ValidationMiddleware, { schema: createUser })
    public async create(req: Request, res: Response) {
        const user = this.repository.create(req.body);
        await this.repository.insert(user);
        res.status(HttpStatus.CREATED);
        return this.serializer.serialize(user);
    }

    @Patch("/:userId")
    @Put("/:userId")
    @MethodMiddleware(ValidationMiddleware, { schema: updateUser })
    public async update(req: Request, res: Response) {
        if (!req.body.password) {
            delete req.body.password;
        }

        let saved = await this.repository.preload({
            ...req.body, ...{id : req.params.userId}
        } as any);

        if (saved === undefined) {
            throw Boom.notFound("User not found");
        }

        saved = await this.repository.save(saved);

        return this.serializer.serialize(saved);
    }

    @Get("/")
    public async list(req: Request, res: Response) {
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

        return this.serializer
            .serialize(users);
    }

    @Get("/:id/:relation")
    public async fetchRelated(req: Request, res: Response) {
        return this.repository.fetchRelated(req, this.serializer);
    }

    @Get("/:id/relationships/:relation")
    public async fetchRelationships(req: Request, res: Response) {
        return this.repository.fetchRelationshipsFromRequest(req, this.serializer);
    }

    @Post("/:id/relationships/:relation")
    public async addRelationships(req: Request, res: Response) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Patch("/:id/relationships/:relation")
    public async updateRelationships(req: Request, res: Response) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:id/relationships/:relation")
    public async removeRelationships(req: Request, res: Response) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:userId")
    public async remove(req: Request, res: Response) {
        const user = await this.repository.findOne(req.params.userId);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
