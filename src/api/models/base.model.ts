import {IModelize} from "@triptyk/nfw-core";
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModel implements IModelize {
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
