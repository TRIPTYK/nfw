import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    Unique,
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
import {imageMimeTypes} from "nfw-core";
import {env, jwtExpirationInterval, jwtSecret} from "nfw-core";


@Entity()
export class User extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "simple-json"
    })
    services: { facebook? : string, google? : string };

    @Column({
        length: 32,
        nullable: false,
        unique : true
    })
    username: string;

    @Column({
        length: 128,
        nullable: false
    })
    password: string;

    @Column({
        length: 128,
        nullable: false,
        unique : true
    })
    email: string;

    @Column({
        length: 32,
        nullable: false
    })
    firstname: string;

    @Column({
        length: 32,
        nullable: false
    })
    lastname: string;

    @Column({
        type: "enum",
        enum: roles,
        default: roles.ghost
    })
    role: roles;

    @CreateDateColumn()
    createdAt;

    @UpdateDateColumn({
        nullable: true
    })
    updatedAt;

    @Column({
        type: Date,
        default: null
    })
    deletedAt;

    @OneToMany(() => Document, document => document.user)
    documents: Document[];

    @OneToOne(() => Document, document => document.user_avatar)
    @JoinColumn()
    avatar: Document;

    private temporaryPassword: string;

    @AfterLoad()
    storeTemporaryPassword(): void {
        this.temporaryPassword = this.password;
    }

    /**
     * @return Serialized user object in JSON-API format
     */
    public whitelist(): object {
        return new UserSerializer().serialize(this);
    }

    /**
     *
     */
    token() {
        const payload = {
            exp: Moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: Moment().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, jwtSecret);
    }

    /**
     * @param password
     */
    async passwordMatches(password: string): Promise<boolean> {
        return Bcrypt.compare(password, this.password);
    }

    /*
        JSON can't have a default value in Mysql , so we need to set the value manually if value is not set
     */
    @BeforeInsert()
    checkServices()
    {
        if (!this.services)
            this.services = {};
    }

    @BeforeUpdate()
    @BeforeInsert()
    checkAvatar() {
        if (this.avatar)
            if (!imageMimeTypes.includes(this.avatar.mimetype))
                throw Boom.notAcceptable('Wrong document type');
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<boolean> {
        try {

            if (this.temporaryPassword === this.password) return true;

            const rounds = env === 'test' ? 1 : 10;

            this.password = await Bcrypt.hash(this.password, rounds);

            return true;
        } catch (error) {
            throw Boom.badImplementation(error.message);
        }
    }
}