import {Request,Response} from "express";
import Boom from '@hapi/boom';
import * as HttpStatus from 'http-status';
import { Controller, SerializerParams } from "@triptyk/nfw-core";
import { PostRepository } from "../repositories/post.repository";
import { BaseController } from "./base.controller";
import { postRelations } from "../enums/json-api/post.enum";
import { PostSerializer } from "../serializers/post.serializer";
import { Post } from "../models/post.model";

@Controller({repository : PostRepository})
export class PostController extends BaseController {
    /**
     * @description GET post by id
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async get(req: Request, res: Response, next: any) {
        const post = await this.repository.jsonApiFindOne(req,req.params.id,postRelations);
        if (!post) { throw Boom.notFound(); }

        return new PostSerializer().serialize(post);
    }

    /**
     * @description LIST post
     * @return {any} result to send to client
     *
     */
    public async list(req: Request, res: Response, next: any) {
        const [posts,total] = await this.repository.jsonApiRequest(req.query,postRelations).getManyAndCount();
        return new PostSerializer( new SerializerParams().enablePagination(req,total) ).serialize(posts);
    }

    /**
     * @description Get post relationships
     * @return {array} of relationships id and type
     *
     */
    public async fetchRelationships(req: Request, res: Response, next: any) {
        return this.repository.fetchRelationshipsFromRequest(req,new PostSerializer());
    }

    /**
     * @description Get related post entities
     * @return
     *
     */
    public async fetchRelated(req: Request, res: Response, next: any) {
        return this.repository.fetchRelated(req,new PostSerializer());
    }

    /**
     * @description CREATE post
     * @return {any} result to send to client
     *
     */
    public async create(req: Request, res: Response, next: any) {
        const post = new Post(req.body);
        const saved = await this.repository.save(post);
        res.status( HttpStatus.CREATED );
        return new PostSerializer().serialize(saved);
    }

    /**
     * @description Add post relationships
     * @return
     *
     */
    public async addRelationships(req: Request, res: Response, next: any) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description UPDATE post
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async update(req: Request, res: Response, next: any) {
        const post = await this.repository.findOne(req.params.id);
        if (!post) throw Boom.notFound();
        this.repository.merge(post, req.body);
        const saved = await this.repository.save(post);
        return new PostSerializer().serialize(saved);
    }

    /**
     * @description REPLACE post relationships
     * @return
     *
     */
    public async updateRelationships(req: Request, res: Response, next: any) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE post
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async remove(req: Request, res: Response, next: any) {
        const post = await this.repository.findOne(req.params.id);
        if (!post) throw Boom.notFound();
        await this.repository.remove(post);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE post relationships
     * @return
     *
     */
    public async removeRelationships(req: Request, res: Response, next: any) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
