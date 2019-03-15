import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { TestSerializer } from "./../serializers/test.serializer";

@Entity()
export class Test {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'varchar',
    nullable:true,
    length : 0,
    
    default : null
  })
  amaury;



  public whitelist() {
    return new TestSerializer().serialize(this);
  }
}
