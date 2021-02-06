import { ParamSchema } from "express-validator";

export type ValidationSchema<T> = {
    [P in keyof T]?: ParamSchema;
};
