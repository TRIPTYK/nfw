import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, OneToMany} from "typeorm";
import {User} from "./user.model";
import { OAuthTypes } from "../enums/oauth-type.enum";
import { JsonApiModel } from "../../core/models/json-api.model";

@Entity()
@Unique(["user", "type"])
export class OAuthToken extends JsonApiModel<OAuthToken> {
    @Column({
        nullable : false,
        type : "text"
    })
    public refreshToken: string;

    @ManyToOne(() => User, {
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
}
