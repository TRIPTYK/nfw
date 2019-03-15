import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { PotatoSerializer } from "./../serializers/potato.serializer";

@Entity()
export class Potato {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'datetime',
    nullable:false,
    
    
     default : () => "CURRENT_TIMESTAMP"
  })
  create_at;

  @Column({
  type: 'datetime',
    nullable:false,
    
    
     default : () => "CURRENT_TIMESTAMP"
  })
  update_at;



  public whitelist() {
    return new PotatoSerializer().serialize(this);
  }
}
