 import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils";
import { OtterSerializer } from "./../serializers/otter.serializer";

@Entity()
export class Otter {

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
    return new OtterSerializer().serializer.serialize(this);
  } 
}