import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { ChocolatSerializer } from "./../serializers/chocolat.serializer";

@Entity()
export class Chocolat {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;


  @Column({
  type: 'int',
    nullable:true,
    width : 11,
    
    default : null
  })
  pourcentage;

  @Column({
  type: 'float',
    nullable:true,
    
    
    default : 2
  })
  banana;

  @Column({
  type: 'double',
    nullable:true,
    
    
    default : 5
  })
  jhjhjhj;



  public whitelist() {
    return new ChocolatSerializer().serialize(this);
  }
}
