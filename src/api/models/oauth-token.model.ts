import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, BeforeInsert, BeforeUpdate} from "typeorm";
import {User} from "./user.model";
import { OAuthTypes } from "../enums/oauth-type.enum";

@Entity()
@Unique(["user", "type"])
export class OAuthToken {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column({
        nullable : false,
        type : "text"
    })
    public refreshToken: string;

    @ManyToOne((type) => User, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    public user: User;

    @Column({
        nullable : false,
        type : "text"
    })
    public accessToken: string;

    @Column({
        enum: OAuthTypes,
        nullable : false,
        type: "enum"
    })
    public type: OAuthTypes;

    public constructor(payload: Partial<OAuthToken> = {}) {
        Object.assign(this, payload);
    }
}
