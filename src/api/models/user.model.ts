import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad } from "typeorm";
import { env, jwtSecret, jwtExpirationInterval } from "../../config/environment.config";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "boom";

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
  
  private temporaryPassword;

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

  @Column("simple-json")
  services: { facebook : string, google: string }

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

  @AfterLoad() 
  storeTemporaryPassword() : void {
    this.temporaryPassword = this.password;
  }

  @BeforeUpdate()
  async hashPassword() {
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
  async passwordMatches(password: string) {
    return Bcrypt.compare(password, this.password);
  }

  

  /**
   * TODO: gérer erreur Mysql
   * @param error 
   */
  static checkDuplicateEmail(error: Error) {
    console.log("CheckDuplicateEmailERROR");
    console.log(error);
    if (error.name === 'MongoError' /*&& error.code === 1062*/) {
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