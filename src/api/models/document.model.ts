import {
    BeforeInsert,
    BeforeRemove, BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import {User} from "./user.model";
import * as Fs from "fs";
import {BaseModel} from "../../core/models/base.model";
import * as Path from "path";
import {MimeTypes, ImageMimeTypes} from "../enums/mime-type.enum";
import {DocumentTypes} from "../enums/document-type.enum";

@Entity()
export class Document extends BaseModel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        enum: DocumentTypes,
        nullable: false,
        type: "simple-enum"
    })
    public fieldname: DocumentTypes;

    @Column()
    public filename: string;

    @Column()
    public path: string;

    @Column({
        enum: MimeTypes,
        nullable : false,
        type: "simple-enum"
    })
    public mimetype: MimeTypes;

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

    public constructor(payload: Partial<Document> = {}) {
        super();
        Object.assign(this, payload);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public updatePath() {
        this.path = Path.dirname(this.path.toString());
    }

    @BeforeRemove()
    @BeforeUpdate()
    public deleteOnDisk() {
        Fs.promises.unlink(`${this.path}/${this.filename}`);

        if (Object.values(ImageMimeTypes).includes(this.mimetype as any)) {
            for (const size of ["xs", "md", "xl"]) {
                Fs.promises.unlink(`${this.path}/${size}/${this.filename}`);
            }
        }
    }
}
