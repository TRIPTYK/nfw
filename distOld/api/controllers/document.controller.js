"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status");
const Boom = require("boom");
const Fs = require("fs");
const document_model_1 = require("./../models/document.model");
const typeorm_1 = require("typeorm");
const document_repository_1 = require("./../repositories/document.repository");
const base_controller_1 = require("./base.controller");
const Pluralize = require("pluralize");
const document_serializer_1 = require("../serializers/document.serializer");
const document_relations_1 = require("../enums/relations/document.relations");
const jsonapi_serializer_1 = require("jsonapi-serializer");
const environment_config_1 = require("../../config/environment.config");
const serializerParams_1 = require("../serializers/serializerParams");
/**
 *
 */
class DocumentController extends base_controller_1.BaseController {
    /**
     * @constructor
     */
    constructor() { super(); }
    /**
     * Retrieve a list of documents, according to some parameters
     *
     * @param {Object}req Request
     * @param {Object}res Response
     * @param {Function}next Function
     *
     * @public
     */
    async list(req, res, next) {
        try {
            const repository = typeorm_1.getCustomRepository(document_repository_1.DocumentRepository);
            const [documents, total] = await repository.jsonApiFind(req, document_relations_1.relations);
            res.json(new document_serializer_1.DocumentSerializer(new serializerParams_1.SerializerParams().enablePagination(req, total)).serialize(documents));
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * public async - fetch relationships id
     *
     * @param  req: Request
     * @param  res : Response
     * @param  next: Function
     */
    async relationships(req, res, next) {
        try {
            const docRepository = typeorm_1.getCustomRepository(document_repository_1.DocumentRepository);
            const tableName = docRepository.metadata.tableName;
            let { documentId, relation } = req.params;
            const serializer = new jsonapi_serializer_1.Serializer(relation, {
                topLevelLinks: {
                    self: () => `${environment_config_1.url}/${tableName}s${req.url}`,
                    related: () => `${environment_config_1.url}/${tableName}s/${documentId}/${Pluralize.plural(relation)}`
                }
            });
            const exists = docRepository.metadata.relations.find(e => [Pluralize.plural(relation), Pluralize.singular(relation)].includes(e.propertyName));
            if (!exists)
                throw Boom.notFound();
            if (['many-to-one', 'one-to-one'].includes(exists.relationType))
                relation = Pluralize.singular(relation);
            const user = await docRepository.createQueryBuilder(docRepository.metadata.tableName)
                .leftJoinAndSelect(`${tableName}.${relation}`, relation)
                .select([`${relation}.id`, `${tableName}.id`]) // select minimal informations
                .where({ id: documentId })
                .getOne();
            if (!user)
                throw Boom.notFound();
            res.json(serializer.serialize(user[relation]));
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * Fetch related resources
     *
     * @param req Request object
     * @param res Response object
     * @param next Next middleware function
     *
     * TODO : allow add json-api includes
     */
    async related(req, res, next) {
        try {
            const docRepository = typeorm_1.getCustomRepository(document_repository_1.DocumentRepository);
            const tableName = docRepository.metadata.tableName;
            let { documentId, relation } = req.params;
            if (!document_relations_1.relations.includes(relation))
                throw Boom.notFound();
            let serializerImport = await Promise.resolve().then(() => require(`../serializers/${Pluralize.singular(relation)}.serializer`));
            serializerImport = serializerImport[Object.keys(serializerImport)[0]];
            const serializer = new jsonapi_serializer_1.Serializer(relation, {
                attributes: serializerImport.withelist,
                topLevelLinks: {
                    self: () => `${environment_config_1.url}/${tableName}s${req.url}`
                }
            });
            const exists = docRepository.metadata.relations.find(e => [Pluralize.plural(relation), Pluralize.singular(relation)].includes(e.propertyName));
            if (!exists)
                throw Boom.notFound();
            if (['many-to-one', 'one-to-one'].includes(exists.relationType))
                relation = Pluralize.singular(relation);
            const user = await docRepository.createQueryBuilder(tableName)
                .leftJoinAndSelect(`${tableName}.${relation}`, relation)
                .where({ id: documentId })
                .getOne();
            if (!user)
                throw Boom.notFound();
            res.json(serializer.serialize(user[relation]));
        }
        catch (e) {
            next(e);
        }
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
    async create(req, res, next) {
        try {
            const documentRepository = typeorm_1.getRepository(document_model_1.Document);
            let document = new document_model_1.Document(req['file']);
            const saved = await documentRepository.save(document);
            res.json(new document_serializer_1.DocumentSerializer().serialize(saved));
        }
        catch (e) {
            next(Boom.expectationFailed(e.message));
        }
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
    async get(req, res, next) {
        try {
            const documentRepository = typeorm_1.getCustomRepository(document_repository_1.DocumentRepository);
            const document = await documentRepository.jsonApiFindOne(req, req.params.documentId, document_relations_1.relations);
            if (!document)
                throw Boom.notFound('Document not found');
            res.json(new document_serializer_1.DocumentSerializer().serialize(document));
        }
        catch (e) {
            next(e);
        }
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
    async update(req, res, next) {
        try {
            const documentRepository = typeorm_1.getRepository(document_model_1.Document);
            const document = await documentRepository.findOne(req.params.documentId);
            if (!document)
                throw Boom.notFound('Document not found');
            if (req['file'].filename !== document.filename) {
                Fs.unlink(document.path.toString(), (err) => {
                    if (err)
                        throw Boom.expectationFailed(err.message);
                });
            }
            documentRepository.merge(document, req['file']);
            const saved = await documentRepository.save(document);
            res.json(new document_serializer_1.DocumentSerializer().serialize(saved));
        }
        catch (e) {
            next(e);
        }
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
    async remove(req, res, next) {
        try {
            const documentRepository = typeorm_1.getRepository(document_model_1.Document);
            const document = await documentRepository.findOne(req.params.documentId);
            if (!document)
                throw Boom.notFound('Document not found');
            Fs.unlink(document.path.toString(), (err) => {
                if (err)
                    throw Boom.expectationFailed(err.message);
                documentRepository.remove(document);
                res.sendStatus(HttpStatus.NO_CONTENT).end();
            });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.DocumentController = DocumentController;
;
