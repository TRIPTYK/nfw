import { ValidationSchema } from "../types/validation";
import * as Joi from "joi";

export const createEntity: ValidationSchema<any> = {
    entity : {
        exists : true,
        custom: {
            options: (value) => {
                const service = Joi.object().keys({
                    serviceName: Joi.string().required(),
                });
                const services = Joi.array().items(service);
                return services.validate(value).errors;
            }
        }
    }
};
