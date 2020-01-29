import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, BeforeInsert, BeforeUpdate} from "typeorm";
import {User} from "./user.model";

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
        enum: ["google", "facebook" , "outlook"],
        nullable : false,
        type: "enum"
    })
    public type: "google" | "facebook" | "outlook";

    public constructor(payload: Partial<OAuthToken> = {}) {
        Object.assign(this, payload);
    }
}
