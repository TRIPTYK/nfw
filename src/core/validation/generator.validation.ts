import { ValidationSchema } from "../types/validation";
import * as Joi from "joi";

export const createEntity: ValidationSchema<any> = {
    columns : {
        exists : true,
        custom: {
            options: (value) => {
                const service = Joi.object().keys({
                    name : Joi.string(),
                    type: Joi.string(),
                    default: Joi.any(),
                    length: Joi.number(),
                    isPrimary: Joi.boolean(),
                    isUnique: Joi.boolean(),
                    nullable : Joi.boolean()
                });
                const services = Joi.array().items(service);
                return services.validate(value).errors ?? true;
            }
        }
    }
};
