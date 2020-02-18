import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import IModel from "../../core/interfaces/model.interface";

export abstract class BaseModel implements IModel {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn({
        nullable: true
    })
    public updated_at: Date;
}
