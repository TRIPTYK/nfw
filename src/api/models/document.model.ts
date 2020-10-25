import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    OneToOne,
    ManyToMany
} from "typeorm";

import {User} from "./user.model";
import {promises as Fs} from "fs";
import * as Path from "path";
import {MimeTypes, ImageMimeTypes} from "../enums/mime-type.enum";
import {DocumentTypes} from "../enums/document-type.enum";
import { JsonApiModel } from "../../core/models/json-api.model";
import { DocumentSerializer } from "../serializers/document.serializer";
import { DocumentRepository } from "../repositories/document.repository";
import { JsonApiEntity } from "../../core/decorators/model.decorator";
import * as DocumentValidator from "../validations/document.validation";

export interface DocumentInterface {
    fieldname: DocumentTypes;
    filename: string;
    originalname: string;
    path: string;
    mimetype: MimeTypes;
    size: number;
    users: User[];
    user_avatar: User;
    deleted_at: Date;
}

@JsonApiEntity("documents", {
    serializer : DocumentSerializer,
    repository : DocumentRepository,
    validator : DocumentValidator
})
export class Document extends JsonApiModel<Document> implements DocumentInterface {
    @Column({
        enum: DocumentTypes,
        nullable: false,
        type: "simple-enum"
    })
    public fieldname: DocumentTypes;

    @Column({
        nullable : false
    })
    public filename: string;

    @Column({
        nullable : false
    })
    public originalname: string;

    @Column({
        nullable : false
    })
    public path: string;

    @Column({
        enum: MimeTypes,
        nullable : false,
        type: "simple-enum"
    })
    public mimetype: MimeTypes;

    @Column({
        nullable : false
    })
    public size: number;

    @ManyToMany(() => User, (user) => user.documents, {
        onDelete: "CASCADE" // Remove all documents when user is deleted
    })
    public users: User[];

    @OneToOne(() => User, (avatar) => avatar.avatar, {
        onDelete: "CASCADE"
    })
    public user_avatar: User;

    @Column({
        default: null
    })
    public deleted_at: Date;

    @BeforeInsert()
    @BeforeUpdate()
    public updatePath(): void {
        this.path = Path.dirname(this.path.toString());
    }

    public async removeAssociatedFiles() {
        const promises = [Fs.unlink(`${this.path}/${this.filename}`)];

        if (Object.values(ImageMimeTypes).includes(this.mimetype as any)) {
            promises.concat(["xs", "md", "xl"].map((size) => Fs.unlink(`${this.path}/${size}/${this.filename}`)));
        }

        return Promise.all(promises);
    }
}
