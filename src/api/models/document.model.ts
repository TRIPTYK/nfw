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
    public id: number;

    @Column({
        enum: documentTypes,
        type: "enum"
    })
    public fieldname: "avatar" | "document" | "cover";

    @Column()
    public filename: string;

    @Column()
    public path: string;

    @Column({
        enum: mimeTypes,
        type: "enum"
    })
    public mimetype: "application/vnd.ms-excel" | "application/msword" | "application/zip" | "application/pdf" | "image/bmp" | "image/gif" | "image/jpeg" | "image/png" | "image/csv";

    @Column({
        type: String
    })
    public size;

    @ManyToOne((type) => User, (user) => user.documents, {
        onDelete: "CASCADE" // Remove all documents when user is deleted
    })
    public user: User;

    @OneToOne((type) => User, (avatar) => avatar.avatar)
    public userAvatar: User;

    @CreateDateColumn()
    public createdAt: Date;
    @UpdateDateColumn({
        nullable: true
    })
    public updatedAt: Date;
    @Column({
        default: null
    })
    public deletedAt: Date;

    @BeforeInsert()
    public updatePath() {
        this.path = Path.dirname(this.path.toString());
    }

    @BeforeRemove()
    @BeforeUpdate()
    public deleteOnDisk() {
        try {   // in some cases , files does not exists , just ignore the remove complain
            Fs.unlink(`${this.path}/${this.filename}`, () => {
                ["xs", "md", "xl"].forEach((ext) => {
                    unlink(`${this.path}/${ext}/${this.filename}`);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
}
