import {Request, Response} from "express";
import * as Boom from "@hapi/boom";
import {checkSchema, Location, Schema, ValidationChain} from "express-validator";
import {getRepository} from "typeorm";
import { BaseSerializer } from "../serializers/base.serializer";

export interface IMiddleware {
    use(req: Request, res: Response, next: (err?: any) => void, args: any);
}

export abstract class BaseMiddleware implements IMiddleware {
    public abstract use(req: Request, res: Response, next: (err?: any) => void, args: any);
}
