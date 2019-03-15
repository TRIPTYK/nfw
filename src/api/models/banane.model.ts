import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { BananeSerializer } from "./../serializers/banane.serializer";

@Entity()
export class Banane {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'datetime',
    nullable:false,
    precision : 6,
    
     default : () => "CURRENT_TIMESTAMP(6)"
  })
  createAt;



  public whitelist() {
    return new BananeSerializer().serialize(this);
  }
}
