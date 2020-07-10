import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index} from "typeorm";
import {User} from "./user.model";

@Entity()
@Unique(["user"])
export class RefreshToken {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public refreshToken: string;

    @ManyToOne(() => User, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    public user: User;

    @Column()
    public expires: Date;

    public constructor(payload: Partial<RefreshToken> = {}) {
        Object.assign(this, payload);
    }
}
