import Boom from '@hapi/boom';
import { BaseMiddleware } from "./base.middleware";
import { CommentSerializer } from "../serializers/comment.serializer";

/**
 * Middleware functions for comment
 *
 */
export class CommentMiddleware extends BaseMiddleware {
    /**
     * @description CommentMiddleware constructor
     *
     */
    constructor() {
        super( new CommentSerializer() );
    }
}
