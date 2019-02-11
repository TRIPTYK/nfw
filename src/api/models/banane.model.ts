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
    type: Date,
    default: DateUtils.mixedDateToDateString( new Date() )
  })
  createdAt;

  @Column({
    type: Date,
    default: null
  })
  updatedAt;

  @Column({
    type: Date,
    default: null
  })
  deletedAt;

  public whitelist() {
    return new BananeSerializer().serializer.serialize(this);
  } 
}