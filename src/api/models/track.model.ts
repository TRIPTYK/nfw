import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { TrackSerializer } from "./../serializers/track.serializer";

import { User } from "./user.model";

@Entity()
export class Track {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'varchar',
    nullable:true,
    length : 255,
    
    default : null
  })
  title;


  @ManyToOne(type => User,user => user.id)
  @JoinColumn({ name: 'userID' , referencedColumnName: 'id' })
  userID : User;


  public whitelist() {
    return new TrackSerializer().serialize(this);
  }
}
