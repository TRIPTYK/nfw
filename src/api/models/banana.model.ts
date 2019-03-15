import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { BananaSerializer } from "./../serializers/banana.serializer";

@Entity()
export class Banana {

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



  public whitelist() {
    return new BananaSerializer().serialize(this);
  }
}
