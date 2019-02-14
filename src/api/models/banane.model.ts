import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
    type: "varchar",
    length : 255,
    default: null

  })
  Name;

 @Column({
    type: "datetime",
    default: null

  })
  BirthDate;

 @Column({
    type: "varchar",
    length : 255,
    default: null

  })
  WaterPoint;

 @Column({
    type: "int",
    length : 11,
    default: null

  })
  grade;



  public whitelist() {
    return new BananeSerializer().serializer.serialize(this);
  } 
}