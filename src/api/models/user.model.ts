import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert } from "typeorm";
import { env, jwtSecret, jwtExpirationInterval } from "../../config/environment.config";
import { DateUtils } from "typeorm/util/DateUtils";

import * as Moment from "moment-timezone";
import * as Jwt from "jwt-simple";
import * as Bcrypt from "bcrypt";
import * as Boom from "boom";

const roles = ['admin', 'user', 'ghost'];

@Entity()
export class User {

  /**
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

  @Column()
  firstname: string;

  @Column({
    length: 32
  })
  lastname: string;

  @Column({
    length: 32,
    default: ""
  })
  picture: string;

  @Column({
    type: "enum",
    enum: ["admin", "user", "ghost"],
    default: "ghost"
  })
  role: "admin" | "user" | "ghost";

  @Column({
    type: Date,
    default: DateUtils.mixedDateToDateString( new Date() )
  })
  createdAt;

  @AfterLoad() 
  storeTemporaryPassword() : void {
    this.temporaryPassword = this.password;
  }

  @BeforeInsert()
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
  public transform() {

    const transformed = {};
    const fields = ['id', 'username', 'email', 'firstname', 'lastname' , 'services', 'picture', 'role', 'createdAt'];

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

  /**
   * 
   */
  static roles = roles;
}