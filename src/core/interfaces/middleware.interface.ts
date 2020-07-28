import { Request , Response } from "express";

export default interface MiddlewareInterface {
    use(req: Request, res: Response, next: (err?: any) => void, args: any): any;
}

