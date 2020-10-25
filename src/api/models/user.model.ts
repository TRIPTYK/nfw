import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    JoinColumn,
    OneToOne, ManyToMany, JoinTable, DeleteDateColumn
} from "typeorm";


import {Document} from "./document.model";
import {Roles} from "../enums/role.enum";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "@hapi/boom";
import {ImageMimeTypes} from "../enums/mime-type.enum";
import { Environments } from "../enums/environments.enum";
import { JsonApiModel } from "../../core/models/json-api.model";
import { UserSerializer } from "../serializers/user.serializer";
import { UserRepository } from "../repositories/user.repository";
import { Filterable, JsonApiEntity } from "../../core/decorators/model.decorator";
import * as UserValidator from "../validations/user.validation";
import ConfigurationService from "../../core/services/configuration.service";
import { container } from "tsyringe";
import ACLService from "../services/acl.service";
import { Permission } from "role-acl";

export interface UserInterface {
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    role: Roles;
    deleted_at: any;
    documents: Document[];
    avatar: Document;
}

@JsonApiEntity("users", {
    serializer : UserSerializer,
    repository : UserRepository,
    validator: UserValidator
})
export class User extends JsonApiModel<User> implements UserInterface {
    @Column({
        default: "User",
        length: 32,
        nullable: false
    })
    @Filterable()
    public username: string;

    @Column({
        length: 128,
        nullable: false
    })
    public password: string;

    @Column({
        length: 128,
        nullable: false,
        unique : true
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

    @JoinTable()
    @ManyToMany(() => Document, (document) => document.users)
    public documents: Document[];

    @OneToOne(() => Document, (document) => document.user_avatar)
    @JoinColumn()
    public avatar: Document;

    @DeleteDateColumn()
    public deleted_at;

    public constructor(payload: Partial<User> = {}) {
        super();
        Object.assign(this, payload);
    }

    @BeforeUpdate()
    @BeforeInsert()
    public checkAvatar(): void {
        if (this.avatar) {
            if (!(this.avatar.mimetype in ImageMimeTypes)) {
                throw Boom.notAcceptable("Wrong document type");
            }
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async hashPassword(): Promise<boolean> {
        try {
            const rounds = container.resolve<ConfigurationService>(ConfigurationService).config.env === Environments.Test ? 1 : 10;
            this.password = await Bcrypt.hash(this.password, rounds);
            return true;
        } catch (error) {
            throw Boom.badImplementation(error.message);
        }
    }

    public generateAccessToken(): string {
        const { jwt : { accessExpires, secret } } = container.resolve<ConfigurationService>(ConfigurationService).config;

        const payload = {
            exp: Moment().add(accessExpires, "minutes").unix(),
            iat: Moment().unix(),
            sub: this.id
        };

        return Jwt.encode(payload, secret);
    }

    public passwordMatches(password: string): Promise<boolean> {
        return Bcrypt.compare(password, this.password);
    }

    public can(method: string, context: any, resource: string): Promise<Permission> {
        const aclService = container.resolve(ACLService);
        return aclService.can(this, method, context, resource);
    }
}
