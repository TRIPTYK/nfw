import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseModel } from "./base.model";
import { Post } from "./post.model";

@Entity()
export class Comment extends BaseModel {
    @Column({
    	type: 'text',
    	nullable: false
    })
    text;
    
    @ManyToOne(type => Post, post => post.comments)
    post: Post;
}
