import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany , CreateDateColumn , UpdateDateColumn,ManyToMany, JoinTable } from "typeorm";
import { env, jwtSecret, jwtExpirationInterval } from "./../../config/environment.config";
import { DateUtils } from "typeorm/util/DateUtils";
import { Document } from "./../models/document.model";
import { roles } from "./../enums/role.enum";
import { UserSerializer } from "./../serializers/user.serializer";
import { IModelize } from "../interfaces/IModelize.interface";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "boom";

@Entity()
export class User implements IModelize {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object) { Object.assign(this, payload); }

  private temporaryPassword : string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true
  })
  username: string;

  @Column({
    length: 128
  })
  password: string

  @Column({
    length: 128,
    unique: true
  })
  email: string;

  @Column({
    type : "simple-json"
  })
  services: { facebook : string, google: string }

  @Column({
    length: 32,
  })
  firstname: string;

  @Column({
    length: 32,
  })
  lastname: string;

  @OneToMany(type => Document, document => document.user, {
    eager: false
  })
  documents: Document[];

  @Column({
    type: "enum",
    enum: roles,
    default: "ghost"
  })
  role: "admin" | "user" | "ghost";


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

  @AfterLoad()
  storeTemporaryPassword() : void {
    this.temporaryPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() : Promise<boolean> {
    try {

      if (this.temporaryPassword === this.password) return true;

      const rounds = env === 'test' ? 1 : 10;

      const hash = await Bcrypt.hash(this.password, rounds);

      this.password = hash;

      return true;
    }
    catch (error) {
      throw Boom.badImplementation(error.message);
    }
  }


  /**
   * @return Serialized user object in JSON-API format
   */
  public whitelist() : object {
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
  async passwordMatches(password: string) : Promise<boolean> {
    return Bcrypt.compare(password, this.password);
  }

  /**
   * @param error
   */
  static checkDuplicateEmail(error) {
    if (error.name === 'QueryFailedError' && error.errno === 1062) {
      return Boom.conflict(
        'Validation error',
        {
          errors: [{
            field: 'email',
            location: 'body',
            messages: ['"Email or Username" already exists'],
          }]
        });
    }
    return error;
  }
}
