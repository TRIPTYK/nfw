import { getCustomRepository, Repository, getRepository } from "typeorm";
import { BaseRepository } from "../../api/repositories/base.repository";
import { Type } from "../types/global";
import { BaseModel } from "../../api/models/base.model";

export function repository(baseRepo: Type<BaseRepository<any>> | Type<BaseModel>): PropertyDecorator {
    return function(target: object, propertyKey: string | symbol) {
        console.log(target);
        if (baseRepo instanceof BaseModel) {
            target[propertyKey] = getRepository(baseRepo);
        } else {
            target[propertyKey] = getCustomRepository(baseRepo);
        }
    };
}
