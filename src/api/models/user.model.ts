import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity, JoinColumn,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";


import {Document} from "./document.model";
import {Roles} from "../enums/role.enum";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "@hapi/boom";
import {BaseModel} from "../../core/models/base.model";
import {ImageMimeTypes} from "../enums/mime-type.enum";
import EnvironmentConfiguration from "../../config/environment.config";
import { Environments } from "../enums/environments.enum";


@Entity()
export class User extends BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        default: "User",
        length: 32,
        nullable: false,
        unique : false
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
        unique : true
    })
    public email: string;

    @Column({
        length: 32,
        nullable: false
    })
    public firstname: string;

    @Column({
        length: 32,
        nullable: false
    })
    public lastname: string;

    @Column({
        default: Roles.Ghost,
        enum: Roles,
        type: "simple-enum"
    })
    public role: Roles;

    @Column({
        default: null,
        type: Date
    })
    public deleted_at;

    @OneToMany(() => Document, (document) => document.user)
    public documents: Document[];

    @OneToOne(() => Document, (document) => document.user_avatar)
    @JoinColumn()
    public avatar: Document;

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
            const rounds = EnvironmentConfiguration.config.env === Environments.Test ? 1 : 10;
            this.password = await Bcrypt.hash(this.password, rounds);
            return true;
        } catch (error) {
            throw Boom.badImplementation(error.message);
        }
    }

    /**
     *
     */
    public generateAccessToken(): string {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { jwt : { access_expires , secret } } = EnvironmentConfiguration.config;

        const payload = {
            exp: Moment().add(access_expires, "minutes").unix(),
            iat: Moment().unix(),
            sub: this.id
        };

        return Jwt.encode(payload, secret);
    }

    /**
     * @param password
     */
    public passwordMatches(password: string): Promise<boolean> {
        return Bcrypt.compare(password, this.password);
    }
}
