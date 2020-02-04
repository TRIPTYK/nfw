import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import IModel from "../interfaces/model.interface";

export abstract class BaseModel implements IModel {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn({
        nullable: true
    })
    public updated_at: Date;

    public constructor(payload: object = {}) {
        Object.assign(this, payload);
    }
}
