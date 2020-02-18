import {Request, Response} from "express";
import IMiddleware from "../../core/interfaces/middleware.interface";

export abstract class BaseMiddleware implements IMiddleware {
    public abstract use(req: Request, res: Response, next: (err?: any) => void, args: any);
}
