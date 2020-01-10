import Boom from '@hapi/boom';
import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "@triptyk/nfw-core";
import { postSerialize, postDeserialize } from "../enums/json-api/post.enum";

export class PostSerializer extends BaseSerializer {
    /**
     * post constructor
     */
    constructor(serializerParams = new SerializerParams()) {
        super('post');
        const data = {
            whitelist: postSerialize,
            whitelistOnDeserialize : postDeserialize,
            relationships: {}
        }
        ;
        this.setupLinks(data, serializerParams);
        this.serializer.register(this.type, data);
    }
}
