import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import ModelInterface from "../interfaces/model.interface";

export abstract class BaseModel implements ModelInterface {
    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn({
        nullable: true
    })
    public updated_at: Date;
}
