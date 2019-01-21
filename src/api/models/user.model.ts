import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

  constructor() { }
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

}