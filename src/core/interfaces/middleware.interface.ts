import { Request , Response } from "express";

export default interface IMiddleware {
    use(req: Request, res: Response, next: (err?: any) => void, args: any);
}

