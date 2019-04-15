"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status");
const Boom = require("boom");
const user_model_1 = require("./../models/user.model");
const user_repository_1 = require("./../repositories/user.repository");
const typeorm_1 = require("typeorm");
const Pluralize = require("pluralize");
const base_controller_1 = require("./base.controller");
const user_serializer_1 = require("../serializers/user.serializer");
const user_relations_1 = require("../enums/relations/user.relations");
const document_repository_1 = require("../repositories/document.repository");
const jsonapi_serializer_1 = require("jsonapi-serializer");
const environment_config_1 = require("../../config/environment.config");
const serializerParams_1 = require("../serializers/serializerParams");
/**
 *
 */
class UserController extends base_controller_1.BaseController {
    /** */
    constructor() { super(); }
    /**
     * Get serialized user
     *
     * @param req Request object
     * @param res Response object
     *
     */
    get(req, res) { res.json(req['locals'].whitelist()); }
    /**
     * Get logged in user info
     *
     * @param req Request object
     * @param res Response object
     *
     */
    loggedIn(req, res) { res.json(req['user'].whitelist()); }
    /**
     * Create new user
     *
     * @param req Request object
     * @param res Response object
     * @param next Next middleware function
     *
     */
    async create(req, res, next) {
        try {
            const repository = typeorm_1.getRepository(user_model_1.User);
            const user = new user_model_1.User(req.body);
            const savedUser = await repository.save(user);
            res.status(HttpStatus.CREATED);
            res.json(new user_serializer_1.UserSerializer().serialize(savedUser));
        }
        catch (e) {
            next(user_model_1.User.checkDuplicateEmail(e));
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
            const docRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const tableName = docRepository.metadata.tableName;
            let { userId, relation } = req.params;
            const serializer = new jsonapi_serializer_1.Serializer(relation, {
                topLevelLinks: {
                    self: () => `${environment_config_1.url}/${tableName}s${req.url}`,
                    related: () => `${environment_config_1.url}/${tableName}s/${userId}/${Pluralize.plural(relation)}`
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
                .where({ id: userId })
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
            const docRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const tableName = docRepository.metadata.tableName;
            let { userId, relation } = req.params;
            if (!user_relations_1.relations.includes(relation))
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
                .where({ id: userId })
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
     * Update existing user
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    async update(req, res, next) {
        try {
            const repository = typeorm_1.getRepository(user_model_1.User);
            const user = await repository.findOne(req.params.userId, { relations: ["documents"] });
            if (req.body.password === null || req.body.password === '') {
                req.body.password = undefined;
            }
            if (req.body.documents)
                user.documents = await typeorm_1.getCustomRepository(document_repository_1.DocumentRepository).findByIds(req.body.documents);
            repository.merge(user, req.body);
            const saved = await repository.save(user);
            res.json(new user_serializer_1.UserSerializer().serialize(saved));
        }
        catch (e) {
            next(user_model_1.User.checkDuplicateEmail(e));
        }
    }
    ;
    /**
     * Get user list
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    async list(req, res, next) {
        try {
            const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const [users, totalUsers] = await repository.jsonApiRequest(req.query, user_relations_1.relations).getManyAndCount();
            res.json(new user_serializer_1.UserSerializer(new serializerParams_1.SerializerParams().enablePagination(req, totalUsers)).serialize(users));
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * Delete user
     *
     * @param req Request
     * @param res Response
     * @param next Next middleware function
     *
     */
    async remove(req, res, next) {
        try {
            const user = req['locals'];
            const repository = typeorm_1.getRepository(user_model_1.User);
            await repository.remove(user);
            res.sendStatus(HttpStatus.NO_CONTENT).end();
        }
        catch (e) {
            console.log(e.message);
            next(e);
        }
    }
}
exports.UserController = UserController;
