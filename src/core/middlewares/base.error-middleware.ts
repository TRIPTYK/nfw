import { ErrorMiddlewareInterface } from "../interfaces/middleware.interface";
import { Request, Response} from "express";

export abstract class BaseErrorMiddleware implements ErrorMiddlewareInterface {
    public abstract use(err: any,req: Request, res: Response, next: (err?: any) => void, args: any): any;
}
