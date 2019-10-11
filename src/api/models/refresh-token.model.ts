import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./user.model";
import {jwtExpirationInterval} from "../../config/environment.config";

@Entity()
@Unique(["user", "ip"])
export class RefreshToken {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public refreshToken: string;

    @ManyToOne((type) => User, {
        eager: true,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    public user: User;

    @Column({
        length : 45
    })
    public ip: string;

    @Column()
    public expires: Date;

    public jwtExpirationInterval: string = jwtExpirationInterval;


    public accessToken: string;

    /**
     *
     * @param refreshToken
     * @param user
     * @param expires
     * @param ip
     */
    constructor(refreshToken: string, user: User, expires: Date, ip: string) {
        this.refreshToken = refreshToken;
        this.expires = expires;
        this.user = user;
        this.ip = ip;
    }
}
