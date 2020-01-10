import Boom from '@hapi/boom';
import { EntityRepository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Comment } from '../models/comment.model';

@EntityRepository(Comment)
export class CommentRepository extends BaseRepository<Comment> {
}
