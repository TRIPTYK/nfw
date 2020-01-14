import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";


import {Document} from "./document.model";
import {roles} from "../enums/role.enum";
import {UserSerializer} from "../serializers/user.serializer";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import Boom from "@hapi/boom";
import {BaseModel} from "./base.model";
import {env, jwtExpirationInterval, jwtSecret} from "../../config/environment.config";
import {imageMimeTypes} from "../enums/mime-type.enum";


@Entity()
export class User extends BaseModel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: "simple-json"
    })
    public services: {
        facebook?: {
            refreshToken: string,
            accessToken: string
        },
        google?: {
            refreshToken: string,
            accessToken: string
        },
        outlook?: {
            refreshToken: string,
            accessToken: string
        }
    };

    @Column({
        length: 32,
        nullable: false,
        unique : true
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
        default: roles.ghost,
        enum: roles,
        type: "enum"
    })
    public role: roles;

    @CreateDateColumn()
    public createdAt;

    @UpdateDateColumn({
        nullable: true
    })
    public updatedAt;

    @Column({
        default: null,
        type: Date
    })
    public deletedAt;

    @OneToMany(() => Document, (document) => document.user)
    public documents: Document[];

    @OneToOne(() => Document, (document) => document.userAvatar)
    @JoinColumn()
    public avatar: Document;

    /**
     *
     */
    public token() {
        const payload = {
            exp: Moment().add(jwtExpirationInterval, "minutes").unix(),
            iat: Moment().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, jwtSecret);
    }

    /**
     * @param password
     */
    public async passwordMatches(password: string): Promise<boolean> {
        return Bcrypt.compare(password, this.password);
    }

    /*
        JSON can't have a default value in Mysql , so we need to set the value manually if value is not set
     */
    @BeforeInsert()
    public checkServices() {
        if (!this.services) {
            this.services = {};
        }
    }

    @BeforeUpdate()
    @BeforeInsert()
    public checkAvatar() {
        if (this.avatar) {
            if (!imageMimeTypes.includes(this.avatar.mimetype)) {
                throw Boom.notAcceptable("Wrong document type");
            }
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async hashPassword(): Promise<boolean> {
        try {
            const rounds = env === "test" ? 1 : 10;
            this.password = await Bcrypt.hash(this.password, rounds);
            return true;
        } catch (error) {
            throw Boom.badImplementation(error.message);
        }
    }
}
