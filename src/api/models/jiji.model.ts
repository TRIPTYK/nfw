import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToOne , JoinColumn , OneToMany , ManyToMany , CreateDateColumn , UpdateDateColumn } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { JijiSerializer } from "./../serializers/jiji.serializer";

@Entity()
export class Jiji {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;




  @CreateDateColumn()
  create_at;

  @UpdateDateColumn()
  update_at;

  public whitelist() {
    return new JijiSerializer().serialize(this);
  }
}
