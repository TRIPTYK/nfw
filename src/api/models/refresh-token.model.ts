import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./../models/user.model";

@Entity()
export class RefreshToken {

  /**
   * 
   * @param token 
   * @param user 
   * @param expires 
   */
  constructor(token: String, user: User, expires: Date) 
  { 
    this.token = token;
    this.expires = expires;
  }

  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  token: String;

  @ManyToMany(type => User)
  @JoinTable()
  users: User[];

  @Column()
  expires: Date;
}
