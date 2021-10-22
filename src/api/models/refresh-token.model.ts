import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique
} from "@triptyk/nfw-core";
import { User } from "./user.model";

@Entity()
@Unique(["user"])
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

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
}
