import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import { JsonApiModel } from "../../core/models/json-api.model";
import { OAuthToken } from "./oauth-token.model";
import { User } from "./user.model";

@Entity()
@Unique(["user"])
export class RefreshToken extends JsonApiModel<OAuthToken> {
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
