import * as HttpStatus from "http-status";
import Boom from "@hapi/boom";
import {Request, Response} from "express";
import {User} from "../models/user.model";
import {UserRepository} from "../repositories/user.repository";
import {BaseController} from "./base.controller";
import {UserSerializer} from "../serializers/user.serializer";
import {userRelations} from "../enums/json-api/user.enum";
import {SerializerParams , Controller} from "@triptyk/nfw-core";

/**
 *
 */
@Controller({
    repository : UserRepository
})
export class UserController extends BaseController {
    /**
     *
     * @param req
     * @param res
     */
    public get(req: Request, res: Response) {
        return new UserSerializer(req["locals"]);
    }

    /**
     *
     * @param req
     * @param res
     */
    public loggedIn(req: Request, res: Response) {
        return new UserSerializer(req["user"]);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async changePassword(req: Request, res: Response, next) {
        let currentUser: User = req["user"];

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
    public async update(req: Request, res: Response, next) {
        if (!req.body.password) {
            req.body.password = undefined;
        }

        const user = await this.repository.findOne(req.params.userId);

        if (!user) {
            throw Boom.notFound();
        }

        this.repository.merge(user, req.body);

        const saved = await this.repository.save(user);

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
    public async list(req: Request, res: Response, next) {
        const [users, totalUsers] = await this.repository.jsonApiRequest(req.query, userRelations).getManyAndCount();
        return new UserSerializer(new SerializerParams().enablePagination(req, totalUsers)).serialize(users);
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
    public async remove(req: Request, res: Response, next) {
        const user = await this.repository.findOne(req.params.userId);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
