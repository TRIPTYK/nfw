import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./user.model";

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

    public jwtExpirationInterval: string;
    public accessToken: string;

    public constructor(payload: Partial<RefreshToken> = {}) {
        Object.assign(this, payload);
    }
}
