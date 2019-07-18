import {AfterInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";
import {jwtExpirationInterval} from "../../config/environment.config";

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

    jwtExpirationInterval : string = jwtExpirationInterval;


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
