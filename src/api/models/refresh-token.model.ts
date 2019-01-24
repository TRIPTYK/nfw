import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
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

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @Column()
  expires: Date;
}
