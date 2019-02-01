import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.model";
import { DateUtils } from "typeorm/util/DateUtils";
import { mimeTypes } from "./../enums/mime-type.enum";
import { documentTypes } from "./../enums/document-type.enum";
import { DocumentSerializer } from "./../serializers/document.serializer";
import { IModelize } from "../interfaces/IModelize.interface";

@Entity()
export class Document implements IModelize {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;

  @Column({
    type: "enum",
    enum: documentTypes
  })
  fieldname: "avatar" | "document" | "cover";

  @Column()
  filename: String;

  @Column()
  path: String;

  @Column({
    type: "enum",
    enum: mimeTypes
  })
  mimetype: "application/vnd.ms-excel" | "application/msword" | "application/zip" | "application/pdf" | "image/bmp" | "image/gif" | "image/jpeg" | "image/png" | "image/csv";

  @Column({
    type: String
  })
  size;

  @ManyToOne(type => User, user => user.documents, {
    onDelete: "CASCADE" // Remove all documents when user is deleted
  })
  user: User;

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
    return new DocumentSerializer().serializer.serialize(this);
  }
}