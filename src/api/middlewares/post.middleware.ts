import Boom from '@hapi/boom';
import { BaseMiddleware } from "./base.middleware";
import { PostSerializer } from "../serializers/post.serializer";

/**
 * Middleware functions for post
 *
 */
export class PostMiddleware extends BaseMiddleware {
    /**
     * @description PostMiddleware constructor
     *
     */
    constructor() {
        super( new PostSerializer() );
    }
}
