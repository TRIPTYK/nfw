import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";

import {Document} from "../models/document.model";
import {Request, Response} from "express";
import {DocumentRepository} from "../repositories/document.repository";
import {BaseController} from "./base.controller";
import {DocumentSerializer} from "../serializers/document.serializer";
import {UserSerializer} from "../serializers/user.serializer";
import {documentRelations} from "../enums/json-api/document.enum";
import { Controller } from "@triptyk/nfw-core";

/**
 *
 */
@Controller({
    repository : DocumentRepository
})
class DocumentController extends BaseController<Document> {
    /**
     * Retrieve a list of documents, according to some parameters
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    public async list(req: Request, res: Response, next) {
        const [documents, total] = await this.repository.jsonApiFind(req, documentRelations);

        if (req.query.page) {
            return new DocumentSerializer({
                pagination : {
                    page: req.query.page.number,
                    size: req.query.page.size,
                    total,
                    url: req.url
                }
            }).serialize(documents);
        }

        return new DocumentSerializer().serialize(documents);
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
    public async create(req: Request, res: Response, next) {
        const file: Express.Multer.File = req["file"];
        const document = this.repository.create(file as any);
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
    public async get(req: Request, res: Response, next) {
        const document = await this.repository.jsonApiFindOne(req, req.params.documentId, documentRelations);

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        return new DocumentSerializer().serialize(document);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelated(req: Request, res: Response, next) {
        return this.repository.fetchRelated(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async fetchRelationships(req: Request, res: Response, next) {
        return this.repository.fetchRelationshipsFromRequest(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async addRelationships(req: Request, res: Response, next) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async updateRelationships(req: Request, res: Response, next) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public async removeRelationships(req: Request, res: Response, next) {
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
    protected async update(req: Request, res: Response, next) {
        const document = await this.repository.findOne(req.params.documentId);
        const file: Express.Multer.File = req["file"];

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        this.repository.merge(document, file as any);
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
    protected async remove(req: Request, res: Response, next) {
        const document = await this.repository.findOne(req.params.documentId);

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        await this.repository.remove(document);

        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}

export {DocumentController};
