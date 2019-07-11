import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    refreshToken: String;

    @OneToOne(type => User, {
        eager: true,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    user: User;

    @Column()
    expires: Date;

    public accessToken: string;

    /**
     *
     * @param refreshToken
     * @param user
     * @param expires
     */
    constructor(refreshToken: string, user: User, expires: Date) {
        this.refreshToken = refreshToken;
        this.expires = expires;
        this.user = user;
    }
}
