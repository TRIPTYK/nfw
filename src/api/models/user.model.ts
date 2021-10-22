import {
    BaseJsonApiModel,
    Column,
    DeleteDateColumn,
    JsonApiEntity,
} from "@triptyk/nfw-core";
import { Roles } from "../enums/role.enum";

@JsonApiEntity("users")
export class User extends BaseJsonApiModel<User> {
    @Column({
        default: "User",
        length: 32,
        nullable: false
    })
    public username: string;

    @Column({
        length: 128,
        nullable: false
    })
    public password: string;

    @Column({
        length: 128,
        nullable: false,
        unique: true
    })
    public email: string;

    @Column({
        length: 32,
        nullable: false
    })
    public first_name: string;

    @Column({
        length: 32,
        nullable: false
    })
    public last_name: string;

    @Column({
        default: Roles.Ghost,
        enum: Roles,
        type: "simple-enum"
    })
    public role: Roles;

    @DeleteDateColumn()
    public deleted_at;
}
