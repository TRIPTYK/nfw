import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { MoartestSerializer } from "./../serializers/moartest.serializer";

@Entity()
export class Moartest {

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
  create_at;

  @Column({
  type: 'datetime',
    nullable:false,
    precision : 6,
    
     default : () => "CURRENT_TIMESTAMP(6)"
  })
  update_at;



  public whitelist() {
    return new MoartestSerializer().serialize(this);
  }
}
