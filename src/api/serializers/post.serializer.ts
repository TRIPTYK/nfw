import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "@triptyk/nfw-core";
import { postSerialize, postDeserialize } from "../enums/json-api/post.enum";
import { CommentSerializer } from "./comment.serializer";

export class PostSerializer extends BaseSerializer {
    /**
     * post constructor
     */
    constructor(serializerParams = new SerializerParams()) {
        super('post');
        const data = {
            whitelist: postSerialize,
            whitelistOnDeserialize : postDeserialize,
            relationships: {
                comments: {type : 'comment'}
            }
        }
        ;
        this.setupLinks(data, serializerParams);
        this.serializer.register(this.type, data);
        this.serializer.register("comment", {
            whitelist : CommentSerializer.whitelist
        }
        );
    }
}
