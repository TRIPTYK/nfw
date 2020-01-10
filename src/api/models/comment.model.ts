import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseModel } from "./base.model";

@Entity()
export class Comment extends BaseModel {
    @Column({
    	type: 'text',
    	nullable: false
    })
    text;
}
