import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";

import { Request, Response } from "express";
import { DocumentSerializer } from "../serializers/document.serializer";
import { UserSerializer } from "../serializers/user.serializer";
import { documentRelations } from "../enums/json-api/document.enum";
import { DocumentRepository } from "../repositories/document.repository";
import { Controller, Post, Get, Patch, Delete, Put, MethodMiddleware, RouteMiddleware } from "../decorators/controller.decorator";
import { getCustomRepository } from "typeorm";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import { DocumentResizeMiddleware } from "../middlewares/document-resize.middleware";
import FileUploadMiddleware from "../middlewares/file-upload.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { updateDocument } from "../validations/document.validation";

@Controller("documents")
@RouteMiddleware(AuthMiddleware,[Roles.Admin, Roles.User])
export default class DocumentController {
    protected repository: DocumentRepository;

    constructor() {
        this.repository = getCustomRepository(DocumentRepository);
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
    @Get("/")
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
    @Post("/")
    @MethodMiddleware(FileUploadMiddleware)
    @MethodMiddleware(DocumentResizeMiddleware)
    public async create(req: Request, res: Response, next) {
        const file: Express.Multer.File = req.file;
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
    @Get("/:documentId")
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
    @Get()
    public async fetchRelated(req: Request, res: Response, next) {
        return this.repository.fetchRelated(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    @Get()
    public async fetchRelationships(req: Request, res: Response, next) {
        return this.repository.fetchRelationshipsFromRequest(req, new UserSerializer());
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    @Post()
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
    @Patch()
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
    @Delete()
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
    @Patch("/:documentId")
    @Put("/:documentId")
    @MethodMiddleware(ValidationMiddleware, {schema : updateDocument})
    @MethodMiddleware(FileUploadMiddleware)
    @MethodMiddleware(DocumentResizeMiddleware)
    public async update(req: Request, res: Response, next) {
        const file: Express.Multer.File = req.file;

        const saved = await this.repository.preload({
            ...file, ...{id : req.params.documentId}
        } as any);

        if (saved === undefined) {
            throw Boom.notFound("Document not found");
        }

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
    @Delete("/:documentId")
    public async remove(req: Request, res: Response, next) {
        const document = await this.repository.findOne(req.params.documentId);

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        await this.repository.remove(document);

        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
