import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";

import { Request, Response } from "express";
import { Post, Get, Patch, Delete, Put, MethodMiddleware, RouteMiddleware, JsonApiController } from "../../core/decorators/controller.decorator";
import AuthMiddleware from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
import { DocumentResizeMiddleware } from "../middlewares/document-resize.middleware";
import FileUploadMiddleware from "../middlewares/file-upload.middleware";
import { updateDocument } from "../validations/document.validation";
import { autoInjectable } from "tsyringe";
import PaginationQueryParams from "../../core/types/jsonapi";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import { Document } from "../models/document.model";
import ValidationMiddleware from "../../core/middlewares/validation.middleware";

@JsonApiController(Document)
@RouteMiddleware(AuthMiddleware, [Roles.Admin, Roles.User])
@autoInjectable()
export default class DocumentController extends BaseJsonApiController<Document> {
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
