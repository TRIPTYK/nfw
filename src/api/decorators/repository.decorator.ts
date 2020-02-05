import { getCustomRepository, Repository, getRepository } from "typeorm";
import { BaseRepository } from "../repositories/base.repository";
import { Type } from "../types/global";
import { BaseModel } from "../models/base.model";

export function repository(baseRepo: Type<BaseRepository<any>> | Type<BaseModel>): PropertyDecorator {
    return function(target: object, propertyKey: string | symbol) {
        if (baseRepo instanceof BaseModel) {
            target[propertyKey] = getRepository(baseRepo);
        } else {
            target[propertyKey] = getCustomRepository(baseRepo);
        }
    };
}
