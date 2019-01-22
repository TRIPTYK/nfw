import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { omitBy, isNil } from "lodash";
import { env, jwtSecret, jwtExpirationInterval } from "../../config/environment.config";
import { UserRepository } from "./../repositories/user.repository";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "boom";

// TODO: implémenter le hook pre save user pour le hash du mot de passe

const roles = ['admin', 'user', 'ghost'];

@Entity()
export class User {

  /**
   * 
   * @param payload 
   */
  constructor(payload: Object) { 

    for(let key in payload)
    {
      this[key] = payload[key];
    }
    
  }
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true
  })
  username: string;

  @Column({
    length: 32
  })
  password: string

  @Column({
    length: 128,
    unique: true
  })
  email: string;

  @Column()
  firstname: string;

  @Column({
    length: 32
  })
  lastname: string;

  @Column({
    length: 32
  })
  picture: string;

  @Column({
    type: "enum",
    enum: ["admin", "user", "ghost"],
    default: "ghost"
  })
  role: "admin" | "user" | "ghost";

  @Column({
    default: Date.now()
  })
  createdAt: Date;

  /**
   * 
   */
  transform() {

    const transformed = {};
    const fields = ['id', 'username', 'email', 'firstname', 'lastname' , 'picture', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  /**
   * 
   */
  token() {
    const payload = {
      exp: Moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: Moment().unix(),
      sub: this.id,
    };
    return Jwt.encode(payload, jwtSecret);
  }

  /**
   * 
   * @param password 
   */
  async passwordMatches(password) {
    return Bcrypt.compare(password, this.password);
  }

  /**
   * TODO: gérer erreur Mysql et non pas mongodb
   * @param error 
   */
  static checkDuplicateEmail(error: Error) {
    if (error.name === 'MongoError' /*&& error.code === 11000*/) {
      return Boom.conflict(
        'Validation error', 
        { 
          errors: [{
            field: 'email',
            location: 'body',
            messages: ['"Email" already exists'],
          }]
        });
    }
    return error;
  }

  /**
   * 
   */
  static roles() {
    return roles;
  }
}