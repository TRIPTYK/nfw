import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { WaterSerializer } from "./../serializers/water.serializer";

@Entity()
export class Water {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'varchar',
    
    length : 255,
     primary : true,
    default : null
  })
  pri;



  public whitelist() {
    return new WaterSerializer().serialize(this);
  }
}
