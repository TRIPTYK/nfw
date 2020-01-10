import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "@triptyk/nfw-core";
import { commentSerialize, commentDeserialize } from "../enums/json-api/comment.enum";
import { PostSerializer } from "./post.serializer";

export class CommentSerializer extends BaseSerializer {
    /**
     * comment constructor
     */
    constructor(serializerParams = new SerializerParams()) {
        super('comment');
        const data = {
            whitelist: commentSerialize,
            whitelistOnDeserialize : commentDeserialize,
            relationships: {
                post: {type : 'post'}
            }
        }
        ;
        this.setupLinks(data, serializerParams);
        this.serializer.register(this.type, data);
        this.serializer.register("post", {
            whitelist : PostSerializer.whitelist
        }
        );
    }
}
