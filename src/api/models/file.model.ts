import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./../models/user.model";

@Entity()
export class File {

  constructor() {  }

  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  name: String;

  @Column()
  path: String;

  @Column()
  mime_type: String;

  @Column()
  size: String;

  @ManyToMany(type => User, { eager : true })
  @JoinTable()
  users: User[];
}