import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseModel } from "./base.model";

@Entity()
export class Pp extends BaseModel {
    /**
     * @description primary key of model
     *
     */
    @PrimaryGeneratedColumn()
    public id;
    @Column({
    	type: 'char',
    	default: 'null',
    	nullable: true,
    	length: 3
    })
    t;
    /**
     * @description This column will store a creation date of the inserted object
     */
    @CreateDateColumn()
    createdAt;
    /**
     * @description This column will store an update date when the entity is updated
     */
    @UpdateDateColumn()
    updatedAt;
}
