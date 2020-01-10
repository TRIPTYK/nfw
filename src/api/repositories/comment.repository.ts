import Boom from '@hapi/boom';
import { EntityRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Comment)
export class CommentRepository extends BaseRepository<Comment> {
    constructor() {
        super();
    }
}
