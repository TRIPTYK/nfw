import {Request, Response} from "express";
import MiddlewareInterface from "../interfaces/middleware.interface";

export abstract class BaseMiddleware implements MiddlewareInterface {
    public abstract use(req: Request, res: Response, next: (err?: any) => void, args: any): any;
}