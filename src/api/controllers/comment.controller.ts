import {Request,Response} from "express";
import Boom from '@hapi/boom';
import * as HttpStatus from 'http-status';
import { Controller, SerializerParams } from "@triptyk/nfw-core";
import { CommentRepository } from "../repositories/comment.repository";
import { BaseController } from "./base.controller";
import { commentRelations } from "../enums/json-api/comment.enum";
import { CommentSerializer } from "../serializers/comment.serializer";

@Controller({repository : CommentRepository})
export class CommentController extends BaseController {
    /**
     * @description GET comment by id
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async get(req: Request, res: Response, next: any) {
        const comment = await this.repository.jsonApiFindOne(req,req.params.id,commentRelations);
        if (!comment) { throw Boom.notFound(); }

        return new CommentSerializer().serialize(comment);
    }

    /**
     * @description LIST comment
     * @return {any} result to send to client
     *
     */
    public async list(req: Request, res: Response, next: any) {
        const [comments,total] = await this.repository.jsonApiRequest(req.query,commentRelations).getManyAndCount();
        return new CommentSerializer( new SerializerParams().enablePagination(req,total) ).serialize(comments);
    }

    /**
     * @description Get comment relationships
     * @return {array} of relationships id and type
     *
     */
    public async fetchRelationships(req: Request, res: Response, next: any) {
        return this.repository.fetchRelationshipsFromRequest(req,new CommentSerializer());
    }

    /**
     * @description Get related comment entities
     * @return
     *
     */
    public async fetchRelated(req: Request, res: Response, next: any) {
        return this.repository.fetchRelated(req,new CommentSerializer());
    }

    /**
     * @description CREATE comment
     * @return {any} result to send to client
     *
     */
    public async create(req: Request, res: Response, next: any) {
        const comment = new Comment(req.body);
        const saved = await this.repository.save(comment);
        res.status( HttpStatus.CREATED );
        return new CommentSerializer().serialize(saved);
    }

    /**
     * @description Add comment relationships
     * @return
     *
     */
    public async addRelationships(req: Request, res: Response, next: any) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description UPDATE comment
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async update(req: Request, res: Response, next: any) {
        const comment = await this.repository.findOne(req.params.id);
        if (!comment) throw Boom.notFound();
        this.repository.merge(comment, req.body);
        const saved = await this.repository.save(comment);
        return new CommentSerializer().serialize(saved);
    }

    /**
     * @description REPLACE comment relationships
     * @return
     *
     */
    public async updateRelationships(req: Request, res: Response, next: any) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE comment
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async remove(req: Request, res: Response, next: any) {
        const comment = await this.repository.findOne(req.params.id);
        if (!comment) throw Boom.notFound();
        await this.repository.remove(comment);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE comment relationships
     * @return
     *
     */
    public async removeRelationships(req: Request, res: Response, next: any) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
