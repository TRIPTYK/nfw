import Boom from '@hapi/boom';
import { EntityRepository } from "typeorm";
import { Post } from "../models/post.model";
import { BaseRepository } from "./base.repository";

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {
    constructor() {
        super();
    }
}
