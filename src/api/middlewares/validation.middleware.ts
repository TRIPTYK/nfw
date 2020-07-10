import { Request, Response, NextFunction } from "express";
import { ValidationChain, checkSchema } from "express-validator";
import { injectable } from "tsyringe";
import { BaseMiddleware } from "../../core/middlewares/base.middleware";

@injectable()
export default class ValidationMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: any): Promise<any> {
        const { schema , location = ["body"] } = args;

        const validationChain: ValidationChain[] = checkSchema(schema, location);

        const res = await Promise.all(validationChain.map((validation) => validation.run(req)));

        const errors = [];

        for (const r of res) {
            if (r.array().length !== 0) {
                errors.push(r.array());
            }
        }

        if (errors.length !== 0) {
            return next(errors);
        }

        return next();
    }
}
