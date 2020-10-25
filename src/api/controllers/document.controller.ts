import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";

import { Request, Response } from "express";
import { JsonApiController, JsonApiMethodMiddleware, OverrideSerializer, OverrideValidator } from "../../core/decorators/controller.decorator";
import { DocumentResizeMiddleware, DocumentResizeMiddlewareArgs } from "../middlewares/document-resize.middleware";
import FileUploadMiddleware, { FileUploadMiddlewareArgs } from "../middlewares/file-upload.middleware";
import { autoInjectable, singleton } from "tsyringe";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import { Document } from "../models/document.model";
import { DeepPartial } from "typeorm";

@JsonApiController(Document)
@singleton()
@autoInjectable()
export default class DocumentController extends BaseJsonApiController<Document> {
    @OverrideSerializer(null)
    @OverrideValidator(null)
    @JsonApiMethodMiddleware<FileUploadMiddlewareArgs>(FileUploadMiddleware, { type : "single", fieldName : "document" })
    @JsonApiMethodMiddleware<DocumentResizeMiddlewareArgs>(DocumentResizeMiddleware)
    public async create(req: Request): Promise<any> {
        const file: Express.Multer.File = req.file;
        const document = this.repository.create(file as DeepPartial<Document>);
        await this.repository.save(document);
        return document;
    }

    @OverrideSerializer(null)
    @OverrideValidator(null)
    @JsonApiMethodMiddleware<FileUploadMiddlewareArgs>(FileUploadMiddleware, { type : "single", fieldName : "document" })
    @JsonApiMethodMiddleware<DocumentResizeMiddlewareArgs>(DocumentResizeMiddleware)
    public async update(req: Request): Promise<any> {
        const file: Express.Multer.File = req.file;

        const originalDocument = await this.repository.findOne(req.params.id);

        if (originalDocument === undefined) {
            throw Boom.notFound("Document not found");
        }

        await originalDocument.removeAssociatedFiles();

        const saved = await this.repository.save(this.repository.merge(originalDocument, file as any));

        return saved;
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
