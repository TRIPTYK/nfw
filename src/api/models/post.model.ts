import { Entity, Column } from "typeorm";
import { BaseModel } from "./base.model";

@Entity()
export class Post extends BaseModel {
    @Column({
    	type: 'varchar',
    	nullable: false,
    	length: 255
    })
    email;
    @Column({
    	type: 'varchar',
    	nullable: false,
    	length: 255
    })
    nacelle;
    @Column({
    	type: 'datetime',
    	default: 'CURRENT_TIMESTAMP',
    	nullable: false
    })
    reserv;
    @Column({
    	type: 'int',
    	nullable: false,
    	width: 11
    })
    place;
    @Column({
    	type: 'varchar',
    	nullable: false,
    	length: 512
    })
    code;
}
