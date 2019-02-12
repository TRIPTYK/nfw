import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
    return new TestSerializer().serializer.serialize(this);
  } 
}