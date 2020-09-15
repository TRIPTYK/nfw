import {Request, Response} from "express";
import MiddlewareInterface from "../interfaces/middleware.interface";
import { RouteContext } from "../application/base.application";

export abstract class BaseMiddleware implements MiddlewareInterface {
    protected context: RouteContext;

    public init(context: RouteContext) {
        this.context = context;
    }
    public abstract use(req: Request, res: Response, next: (err?: any) => void, args: any): any;
}