import {
    BeforeInsert,
    BeforeRemove, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import {User} from "./user.model";
import * as Fs from "fs";
import {BaseModel} from "./base.model";
import * as Path from "path";
import {promisify} from "util";
import {mimeTypes} from "../enums/mime-type.enum";
import {documentTypes} from "../enums/document-type.enum";


const unlink = promisify(Fs.unlink);

@Entity()
export class Document extends BaseModel {
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

    @OneToOne(type => User, avatar => avatar.avatar)
    user_avatar: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn({
        nullable: true
    })
    updatedAt: Date;
    @Column({
        default: null
    })
    deletedAt: Date;

    @BeforeInsert()
    updatePath() {
        this.path = Path.dirname(this.path.toString());
    }

    @BeforeRemove()
    @BeforeUpdate()
    deleteOnDisk() {
        try {   // in some cases , files does not exists , just ignore the remove complain
            Fs.unlink(this.path.toString() + '/' + this.filename, () => {
                ['xs', 'md', 'xl'].forEach((ext) => {
                    unlink(this.path.toString() + '/' + ext + '/' + this.filename);
                });
            });
        }catch (e) {
            console.log(e);
        }
    }
}
