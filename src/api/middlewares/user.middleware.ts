import * as Boom from "boom";

import {Request, Response} from "express";
import {UserRepository} from "../repositories/user.repository";
import {getCustomRepository} from "typeorm";
import {User} from "../models/user.model";
import {UserSerializer} from "../serializers/user.serializer";
import {BaseMiddleware} from "./base.middleware";
import {relations as userRelations} from "../enums/relations/user.relations";

export class UserMiddleware extends BaseMiddleware {

    constructor() {
        super(new UserSerializer());
    }

    /**
     * Load user and append to req
     *
     * @param req Request object
     * @param res Response object
     * @param next Next middleware function
     * @param id User id
     *
     */
    public load = async (req: Request, res: Response, next: Function, id: number): Promise<Function> => {
        try {
            const repository = getCustomRepository(UserRepository);
            req['locals'] = new User(await repository.jsonApiFindOne(req, id, userRelations));
            return next();
        } catch (e) {
            return next(e);
        }
    };

    public async authorizeOwner(req, res, next) {
        try {
            const userRepository = getCustomRepository(UserRepository);
            const user = await userRepository.findOne(req.params.userId);

            if (!user) throw Boom.notFound();

            if (user.id !== req.user.id) {
                throw Boom.unauthorized();
            }

            return next();
        } catch (e) {
            return next(e);
        }
    }
}
