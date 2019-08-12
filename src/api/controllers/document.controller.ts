import * as HttpStatus from "http-status";
import * as Boom from "boom";

import {Document} from "../models/document.model";
import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {DocumentRepository} from "../repositories/document.repository";
import {BaseController} from "./base.controller";
import {DocumentSerializer} from "../serializers/document.serializer";
import {SerializerParams} from "../serializers/serializerParams";
import {BaseRepository} from "../repositories/base.repository";
import {UserSerializer} from "../serializers/user.serializer";
import {documentRelations} from "../enums/json-api/document.enums";

/**
 *
 */
class DocumentController extends BaseController {

    protected repository: BaseRepository<Document>;

    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Retrieve a list of documents, according to some parameters
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    public async list(req: Request, res: Response, next: Function) {
        const [documents, total] = await this.repository.jsonApiFind(req, documentRelations);
        return new DocumentSerializer(new SerializerParams().enablePagination(req, total)).serialize(documents);
    }

    /**
     * Create a new document
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    public async create(req: Request, res: Response, next: Function) {
        let document = new Document(req['file']);
        const saved = await this.repository.save(document);
        return new DocumentSerializer().serialize(saved);
    }

    /**
     * Retrieve one document according to :documentId
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    public async get(req: Request, res: Response, next: Function) {
        const document = await this.repository.jsonApiFindOne(req, req.params.documentId, documentRelations);

        if (!document) throw Boom.notFound('Document not found');

        return new DocumentSerializer().serialize(document);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelated(req: Request, res: Response, next: Function) {
        return this.repository.fetchRelated(req,new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelationships(req: Request, res: Response, next: Function) {
        return this.repository.fetchRelationshipsFromRequest(req,new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async addRelationships(req: Request, res: Response, next: Function) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async updateRelationships(req: Request, res: Response, next: Function) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async removeRelationships(req: Request, res: Response, next: Function) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }


    /**
     * Update one document according to :documentId
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    async update(req: Request, res: Response, next: Function) {
        const document = await this.repository.findOne(req.params.documentId);

        if (!document) throw Boom.notFound('Document not found');

        this.repository.merge(document, req['file']);
        const saved = await this.repository.save(document);

        return new DocumentSerializer().serialize(saved);
    }

    /**
     * Delete one document according to :documentId
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    public async remove(req: Request, res: Response, next: Function) {
        const document = await this.repository.findOne(req.params.documentId);

        if (!document) throw Boom.notFound('Document not found');

        await this.repository.remove(document);

        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    protected beforeMethod(): void {
        this.repository = getCustomRepository(DocumentRepository);
    }
}

export {DocumentController};
