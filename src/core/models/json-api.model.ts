import { PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "./base.model";

export abstract class JsonApiModel<T> extends BaseModel {
    @PrimaryGeneratedColumn()
    public id: number;

    public constructor(payload: Partial<T> = {}) {
        super();
        Object.assign(this, payload);
    }
}
