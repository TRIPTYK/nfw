import { Entity, Column } from "typeorm";
import { BaseModel } from "./base.model";

@Entity()
export class Setting extends BaseModel {
    @Column({
    	type: 'int',
    	nullable: false,
    	width: 11
    })
    hours_start_save;
    @Column({
    	type: 'int',
    	default: 'null',
    	nullable: true,
    	width: 11
    })
    minute_start_save;
    @Column({
    	type: 'int',
    	default: 'null',
    	nullable: true,
    	width: 11
    })
    hours_end_save;
    @Column({
    	type: 'int',
    	default: 'null',
    	nullable: true,
    	width: 11
    })
    minute_end_save;
    @Column({
    	type: 'int',
    	default: 'null',
    	nullable: true,
    	width: 11
    })
    interval_save;
}
