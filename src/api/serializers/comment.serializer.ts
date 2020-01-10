import Boom from '@hapi/boom';
import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "@triptyk/nfw-core";
import { commentSerialize, commentDeserialize } from "../enums/json-api/comment.enum";

export class CommentSerializer extends BaseSerializer {
    /**
     * comment constructor
     */
    constructor(serializerParams = new SerializerParams()) {
        super('comment');
        const data = {
            whitelist: commentSerialize,
            whitelistOnDeserialize : commentDeserialize,
            relationships: {}
        }
        ;
        this.setupLinks(data, serializerParams);
        this.serializer.register(this.type, data);
    }
}
