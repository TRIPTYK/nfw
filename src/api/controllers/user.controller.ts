import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import {Request , Response} from "express";
import {UserSerializer} from "../serializers/user.serializer";
import {userRelations} from "../enums/json-api/user.enum";
import { UserRepository } from "../repositories/user.repository";
import { Controller, Get, Post, Patch, Put, Delete, RouteMiddleware, MethodMiddleware } from "../decorators/controller.decorator";
import { getCustomRepository } from "typeorm";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import { SecurityMiddleware } from "../middlewares/security.middleware";

@Controller("users")
@RouteMiddleware(AuthMiddleware, [Roles.User])
@RouteMiddleware(SecurityMiddleware)
export default class UserController {
    protected repository: UserRepository;

    /**
     *
     */
    constructor() {
        this.repository = getCustomRepository(UserRepository);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    @Get("/:userId")
    public async get(req: Request, res: Response, next) {
        const user = await this.repository.jsonApiFindOne(req, req.params.userId, userRelations);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return new UserSerializer().serialize(user);
    }

    /**
     *
     * @param req
     * @param res
     */
    @Get("/loggedIn")
    public loggedIn(req: Request, res: Response) {
        return new UserSerializer().serialize(req.user);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    @Post("/changePassword")
    public async changePassword(req: Request, res: Response, next) {
        let currentUser = req.user;

        if (await currentUser.passwordMatches(req.body.old_password)) {
            currentUser.password = req.body.new_password;
        }

        currentUser = await this.repository.save(currentUser);

        return new UserSerializer().serialize(currentUser);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    @Post("/")
    public async create(req: Request, res: Response, next) {
        const user = this.repository.create(req.body);
        const savedUser = await this.repository.save(user);
        res.status(HttpStatus.CREATED);
        return new UserSerializer().serialize(savedUser);
    }

    /**
     * Update existing user
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    @Patch("/:userId")
    @Put("/:userId")
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

    /**
     * Get user list
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
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

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelated(req: Request, res: Response, next) {
        return this.repository.fetchRelated(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelationships(req: Request, res: Response, next) {
        return this.repository.fetchRelationshipsFromRequest(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async addRelationships(req: Request, res: Response, next) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async updateRelationships(req: Request, res: Response, next) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async removeRelationships(req: Request, res: Response, next) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }


    /**
     * Delete user
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
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
