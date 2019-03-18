import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { DatetestSerializer } from "./../serializers/datetest.serializer";

@Entity()
export class Datetest {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'datetime',
    nullable:true,
    
    
    default : null
  })
  datetest;



  public whitelist() {
    return new DatetestSerializer().serialize(this);
  }
}
