import { Request, Response } from "express";
import { ValidationChain, checkSchema, Location } from "express-validator";
import { injectable } from "tsyringe";
import { BaseMiddleware } from "../../core/middlewares/base.middleware";

@injectable()
export default class ValidationMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: (err?: any) => void, args: any) {
        const { schema , location = ["body"] } = args;

        const validationChain: ValidationChain[] = checkSchema(schema, location);

        const res = await Promise.all(validationChain.map((validation) => validation.run(req)));

        const errors = [];

        for (const r of res) {
            if (r.errors.length !== 0) {
                errors.push(r.errors);
            }
        }

        if (errors.length !== 0) {
            return next(errors);
        }

        return next();
    }
}
