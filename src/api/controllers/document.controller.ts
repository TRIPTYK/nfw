import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";

import { Request, Response } from "express";
import { DocumentSerializer } from "../serializers/document.serializer";
import { documentRelations } from "../enums/json-api/document.enum";
import { DocumentRepository } from "../repositories/document.repository";
import { Controller, Post, Get, Patch, Delete, Put, MethodMiddleware, RouteMiddleware } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import { DocumentResizeMiddleware } from "../middlewares/document-resize.middleware";
import FileUploadMiddleware from "../middlewares/file-upload.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { updateDocument } from "../validations/document.validation";
import { autoInjectable } from "tsyringe";
import { getCustomRepository } from "typeorm";
import PaginationQueryParams from "../../core/types/jsonapi";
import ControllerInterface from "../../core/interfaces/controller.interface";

@Controller("documents")
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@autoInjectable()
export default class DocumentController implements ControllerInterface {
    private repository: DocumentRepository;

    public constructor( private serializer?: DocumentSerializer ) {
        this.repository = getCustomRepository(DocumentRepository);
    }

    @Get("/")
    public async list(req: Request): Promise<any> {
        const [documents, total] = await this.repository.jsonApiFind(req);

        if (req.query.page) {
            const page: PaginationQueryParams = req.query.page as any;

            return this.serializer.serialize(documents,{
                paginationData : {
                    page: page.number,
                    size: page.size,
                    total,
                    url: req.url
                }
            });
        }

        return this.serializer.serialize(documents);
    }

    @Post("/")
    @MethodMiddleware(FileUploadMiddleware)
    @MethodMiddleware(DocumentResizeMiddleware)
    public async create(req: Request): Promise<void> {
        const file: Express.Multer.File = req.file;
        const document = this.repository.create(file as object);
        await this.repository.save(document);
        return this.serializer.serialize(document);
    }

    /**
     * Retrieve one document according to :id
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    @Get("/:id")
    public async get(req: Request): Promise<any> {
        const document = await this.repository.jsonApiFindOne(req, req.params.id);

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        return this.serializer.serialize(document);
    }

    @Get("/:id/:relation")
    public async fetchRelated(req: Request): Promise<any> {
        return this.repository.fetchRelated(req, this.serializer);
    }

    @Get("/:id/relationships/:relation")
    public async fetchRelationships(req: Request): Promise<any> {
        //return this.repository.fetchRelationshipsFromRequest();
    }

    @Post("/:id/relationships/:relation")
    public async addRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Patch("/:id/relationships/:relation")
    public async updateRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Delete("/:id/relationships/:relation")
    public async removeRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    @Patch("/:id")
    @Put("/:id")
    @MethodMiddleware(ValidationMiddleware, {schema : updateDocument})
    @MethodMiddleware(FileUploadMiddleware)
    @MethodMiddleware(DocumentResizeMiddleware)
    public async update(req: Request): Promise<any> {
        const file: Express.Multer.File = req.file;

        const originalDocument = await this.repository.findOne(req.params.id);

        if (originalDocument === undefined) {
            throw Boom.notFound("Document not found");
        }

        await originalDocument.removeAssociatedFiles();

        const saved = await this.repository.save(this.repository.merge(originalDocument,file as any));

        return this.serializer.serialize(saved);
    }

    /**
     * Delete one document according to :id
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    @Delete("/:id")
    public async remove(req: Request, res: Response): Promise<any> {
        const document = await this.repository.findOne(req.params.id);

        if (!document) {
            throw Boom.notFound("Document not found");
        }

        await document.removeAssociatedFiles();
        await this.repository.remove(document);

        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
