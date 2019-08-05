import {AfterInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./user.model";
import {jwtExpirationInterval} from "../../config/environment.config";
import {IPVersion} from "express-validator/src/options";

@Entity()
@Unique(["user","ip"])
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    refreshToken: String;

    @ManyToOne(type => User, {
        eager: true,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    user: User;

    @Column({
        length : 45
    })
    ip : string;

    @Column()
    expires: Date;

    jwtExpirationInterval : string = jwtExpirationInterval;


    public accessToken: string;

    /**
     *
     * @param refreshToken
     * @param user
     * @param expires
     * @param ip
     */
    constructor(refreshToken: string, user: User, expires: Date,ip :string) {
        this.refreshToken = refreshToken;
        this.expires = expires;
        this.user = user;
        this.ip = ip;
    }
}
