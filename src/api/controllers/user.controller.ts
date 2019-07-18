import * as HttpStatus from "http-status";
import * as Boom from "boom"
import {Request, Response} from "express";
import {User} from "../models/user.model";
import {UserRepository} from "../repositories/user.repository";
import {getCustomRepository} from "typeorm";
import {BaseController} from "./base.controller";
import {UserSerializer} from "../serializers/user.serializer";
import {relations as userRelations} from "../enums/relations/user.relations";
import {SerializerParams} from "../serializers/serializerParams";
import {BaseRepository} from "../repositories/base.repository";


/**
 *
 */
export class UserController extends BaseController {

    protected repository: BaseRepository<User>;

    constructor() {
        super();
    }

    /**
     *
     * @param req
     * @param res
     */
    public get(req: Request, res: Response) {
        return req['locals'].whitelist()
    }

    /**
     *
     * @param req
     * @param res
     */
    public loggedIn(req: Request, res: Response) {
        return req['user'].whitelist()
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async changePassword(req: Request, res: Response, next) {
        let currentUser: User = req['user'];

        if (currentUser.passwordMatches(req.body.old_password)) {
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
    public async create(req: Request, res: Response, next: Function) {
        const user = new User(req.body);
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
    public async update(req: Request, res: Response, next: Function) {
        if (!req.body.password) {
            req.body.password = undefined;
        }

        const user = await this.repository.findOne(req.params.userId);

        if (!user) throw Boom.notFound();

        this.repository.merge(user, req.body);

        const saved = await this.repository.save(user);

        return new UserSerializer().serialize(saved);
    };

    /**
     * Get user list
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    public async list(req: Request, res: Response, next: Function) {
        const [users, totalUsers] = await this.repository.jsonApiRequest(req.query, userRelations).getManyAndCount();
        return new UserSerializer(new SerializerParams().enablePagination(req, totalUsers)).serialize(users);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelationships(req: Request, res: Response, next: Function) {
        const {id, relation} = req.params;

        const questionary = await this.repository.createQueryBuilder('user')
            .leftJoinAndSelect(`user.${relation}`, 'relation')
            .where("user.id = :id", {id})
            .getOne();

        const serializer = new UserSerializer();
        const relationSchemaData = serializer.getSchemaData().relationships.relation;

        return {
            data: serializer.serializeRelationships(relationSchemaData.type, questionary)
        };
    }

    /**
     * Delete user
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    public async remove(req: Request, res: Response, next: Function) {
        const user = await this.repository.findOne(req.params.userId);

        if (!user) throw Boom.notFound();

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    protected beforeMethod(): void {
        this.repository = getCustomRepository(UserRepository);
    }
}
