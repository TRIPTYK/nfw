import {Request, Response} from "express";
import {UserRepository} from "../repositories/user.repository";
import {getCustomRepository} from "typeorm";
import {UserSerializer} from "../serializers/user.serializer";
import {BaseMiddleware} from "./base.middleware";
import {userRelations} from "../enums/json-api/user.enum";

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
            req['locals'] = await repository.jsonApiFindOne(req, id, userRelations);
            return next();
        } catch (e) {
            return next(e);
        }
    };
}
