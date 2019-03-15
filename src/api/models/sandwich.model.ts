import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { SandwichSerializer } from "./../serializers/sandwich.serializer";

@Entity()
export class Sandwich {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'enum',
    nullable:true,
    enum  : ['banana','otter','yeah'],
    
    default : null
  })
  enum;



  public whitelist() {
    return new SandwichSerializer().serialize(this);
  }
}
