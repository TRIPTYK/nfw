import {
    BeforeInsert,
    BeforeRemove, BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
} from "typeorm";

import {User} from "./user.model";
import * as Fs from "fs";
import {BaseModel} from "./base.model";
import * as Path from "path";
import {mimeTypes, imageMimeTypes} from "../enums/mime-type.enum";
import {documentTypes} from "../enums/document-type.enum";

@Entity()
export class Document extends BaseModel {
    @Column({
        enum: documentTypes,
        nullable: false,
        type: "simple-enum"
    })
    public fieldname: "avatar" | "document" | "cover";

    @Column()
    public filename: string;

    @Column()
    public path: string;

    @Column({
        enum: mimeTypes,
        nullable : false,
        type: "simple-enum"
    })
    public mimetype: string;

    @Column()
    public size: number;

    @ManyToOne((type) => User, (user) => user.documents, {
        onDelete: "CASCADE" // Remove all documents when user is deleted
    })
    public user: User;

    @OneToOne((type) => User, (avatar) => avatar.avatar)
    public userAvatar: User;

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
        Fs.unlinkSync(`${this.path}/${this.filename}`);

        for (const size of ["xs", "md", "xl"]) {
            Fs.unlinkSync(`${this.path}/${size}/${this.filename}`);
        }
    }
}
