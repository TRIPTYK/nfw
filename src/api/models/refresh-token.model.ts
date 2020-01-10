import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./user.model";
import {jwtExpirationInterval} from "../../config/environment.config";

@Entity()
@Unique(["user", "ip", "pid"])
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
        length : 45,
        nullable : false
    })
    public ip: string;

    @Column({
        default : 0
    })
    public pid: number;

    @Column()
    public expires: Date;

    public jwtExpirationInterval: string = jwtExpirationInterval;
    public accessToken: string;

    public constructor(payload: object = {}) {
        Object.assign(this, payload);
    }
}
