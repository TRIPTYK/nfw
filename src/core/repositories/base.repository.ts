import {Brackets, Repository, ObjectLiteral, EntityMetadata, SelectQueryBuilder} from "typeorm";
import * as SqlString from "sqlstring";
import {Request} from "express";
import * as Boom from "@hapi/boom";
import * as dashify from "dashify";
import PaginationQueryParams from "../types/jsonapi";
import { ApplicationRegistry } from "../application/registry.application";

interface JsonApiRequestParams {
    includes?: string[];
    sort?: string[];
    fields?: ObjectLiteral;
    page?: PaginationQueryParams;
    filter?: any;
}

/**
 * Base Repository class , inherited for all current repositories
 */
export default class BaseJsonApiRepository<T> extends Repository<T> {
    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    public jsonApiRequest(
        params: JsonApiRequestParams,
        {allowIncludes = true, allowSorting = true, allowPagination = true, allowFields = true, allowFilters = true}:
        {allowIncludes?: boolean ;allowSorting?: boolean ;allowPagination?: boolean ;allowFields?: boolean; allowFilters?: boolean } = {},
        parentQueryBuilder?: SelectQueryBuilder<T>
    ): SelectQueryBuilder<T> {
        const currentTable = this.metadata.tableName;
        const splitAndFilter = (string: string, symbol: string) => string
            .split(symbol)
            .map((e) => e.trim()).filter((str) => str !== ""); // split parameters and filter empty strings

        const queryBuilder = parentQueryBuilder ? parentQueryBuilder : this.createQueryBuilder(currentTable);
        const select: string[] = [`${currentTable}.id`];

        /**
         * Check if include parameter exists
         * An endpoint MAY also support an include request parameter
         * to allow the client to customize which related resources should be returned.
         * @ref https://jsonapi.org/format/#fetching-includes
         */
        if (allowIncludes && params.includes) {
            this.handleIncludes(queryBuilder, params.includes, currentTable, this.metadata, "");
        }

        /**
         * Check if sort parameter exists
         * A server MAY choose to support requests to sort
         * resource collections according to one or more criteria (“sort fields”).
         * @ref https://jsonapi.org/format/#fetching-sorting
         */
        if (allowSorting && params.sort) {
            this.handleSorting(queryBuilder, params.sort);
        }

        if (allowFields && params.fields) {
            this.handleSparseFields(queryBuilder, params.fields, [], select);
            queryBuilder.select(select);
        }


        /**
         * Check if pagination is enabled
         * A server MAY choose to limit the number of resources
         * returned in a response to a subset (“page”) of the whole set available.
         * @ref https://jsonapi.org/format/#fetching-pagination
         */
        if (allowPagination && params.page) {
            this.handlePagination(queryBuilder, {
                number : params.page.number,
                size: params.page.size
            });
        }

        if (allowFilters && params.filter) {
            // put everything into sub brackets to not interfere with more important search params
            const queryBrackets = new Brackets((qb) => {
                for (const key in params.filter) {
                    for (let strategy in params.filter[key]) {
                        let sqlExpression: string;
                        const value = params.filter[key][strategy];
                        let conditionalOperator = "and";

                        // remove "and" or "or"
                        if (strategy.startsWith("or")) {
                            strategy = strategy.substring(2);
                            conditionalOperator = "or";

                        } else if (strategy.startsWith("and")) {
                            strategy = strategy.substring(3);
                            conditionalOperator = "and";
                        }

                        switch (strategy) {
                        case "like" :
                            sqlExpression = (SqlString.format("?? LIKE ?", [key, value]));
                            break ;
                        case "eq" :
                            sqlExpression = SqlString.format("?? = ?", [key, value]);
                            break ;
                        case "noteq" :
                            sqlExpression = SqlString.format("NOT ?? = ?", [key, value]);
                            break ;
                        case "in":
                            sqlExpression = SqlString.format("?? IN (?)", [key, splitAndFilter(value, "+")]);
                            break ;
                        case "notin" :
                            sqlExpression = SqlString.format("?? NOT IN (?)", [key, splitAndFilter(value, "+")]);
                            break ;
                            // eslint-disable-next-line no-lone-blocks
                        case "btw": {
                            const andvalues = splitAndFilter(value, "+");
                            if (andvalues.length !== 2) { throw Boom.badRequest("Must have 2 values in between filter"); }
                            sqlExpression = SqlString.format("?? BETWEEN ? AND ?", [key, andvalues[0], andvalues[1]]);
                        }
                            break;
                        case "orsupeq":
                            sqlExpression = SqlString.format("?? >= ?", [key, value]);
                            break;
                        case "andlesseq":
                            sqlExpression = SqlString.format("?? <= ?", [key, value]);
                            break;
                        default:
                            throw Boom.badRequest(`Unrecognized filter : ${strategy}`);
                        }

                        if (conditionalOperator === "or") {
                            qb.orWhere(sqlExpression);
                        } else {
                            qb.andWhere(sqlExpression);
                        }
                    }
                }
            });
            queryBuilder.andWhere(queryBrackets);
        }

        return queryBuilder;
    }


    /**
     * Shortcut function to make a JSON-API findOne request on id key
     */
    public jsonApiFindOne(req: Request, id: any, options?:
    { allowIncludes?: boolean;allowSorting?: boolean ; allowPagination?: boolean;allowFields?: boolean;allowFilters?: boolean }
    ): Promise<T> {
        return this.jsonApiRequest(req.query, options)
            .where(`${this.metadata.tableName}.id = :id`, {id})
            .getOne();
    }

    /**
     * Shortcut function to make a JSON-API findMany request with data used for pagination
     */
    public jsonApiFind(req: Request, options?:
    { allowIncludes?: boolean;allowSorting?: boolean; allowPagination?: boolean;allowFields?: boolean;allowFilters?: boolean }
    ): Promise<[T[], number]> {
        return this.jsonApiRequest(req.query, options)
            .getManyAndCount();
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelated(relationName: string, id: string | number, params: JsonApiRequestParams): Promise<any> {
        const thisRelation = this.metadata.findRelationWithPropertyPath(relationName);

        if (!thisRelation) {
            throw Boom.notFound();
        }

        const otherEntity = thisRelation.type as any;
        const otherRepo = ApplicationRegistry.repositoryFor(otherEntity);
        const alias = otherRepo.metadata.tableName;
        const aliasRelation = this.buildAlias(alias, thisRelation.inverseSidePropertyPath);

        if ((await this.count({where : {id}})) === 0) {
            throw Boom.notFound();
        }

        const resultQb = otherRepo.createQueryBuilder(otherRepo.metadata.tableName)
            .leftJoin(`${alias}.${thisRelation.inverseSidePropertyPath}`, aliasRelation)
            .where(`${aliasRelation}.id = :id`, {id});

        otherRepo.jsonApiRequest(params, {}, resultQb);

        const result = await (
            thisRelation.isManyToOne || thisRelation.isOneToOne ?
                resultQb.getOne() :
                resultQb.getMany()
        );

        return result;
    }

    /**
     *
     * @param req
     */
    public async addRelationshipsFromRequest(relationName: string, id: string | number, body: {id: string}[] | {id: string}): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(relationName);

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            relations = [];
            for (const value of body as {id: string}[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as {id: string}).id;
        }

        const qb = this.createQueryBuilder()
            .relation(relationName)
            .of(user);

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            return qb.add(relations);
        } 
        return qb.set(relations);
        
    }

    /**
     *
     * @param req
     */
    public async updateRelationshipsFromRequest(relationName: string, id: string | number, body: {id: string}[] | {id: string}): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(relationName);

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;
        const isMany = thisRelation.isManyToMany || thisRelation.isOneToMany;

        if (isMany) {
            relations = [];
            for (const value of body as {id: string}[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as {id: string}).id;
        }

        user[relationName] = isMany ? [] : null;
        await this.save(user);

        const qb = this.createQueryBuilder()
            .relation(relationName)
            .of(user);

        if (isMany) {
            return qb.add(relations);
        } 
        return qb.set(relations);
        
    }

    /**
     *
     * @param req
     */
    public async removeRelationshipsFromRequest(relationName: string, id: string | number, body: {id: string}[] | {id: string}): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(relationName);

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            relations = [];
            for (const value of body as {id: string}[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as {id: string}).id;
        }

        const qb = this.createQueryBuilder()
            .relation(relationName)
            .of(user);

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            return qb.remove(relations);
        } 
        return qb.set(null);
    }

    public handlePagination(qb: SelectQueryBuilder<any>, {number, size}: PaginationQueryParams) {
        qb
            .skip((number - 1) * number)
            .take(size);
    }

    public handleSorting(qb: SelectQueryBuilder<any>, sort: string[]) {
        for (const field of sort) {
            if (field.startsWith("-")) { // JSON-API convention , when sort field starts with '-' order is DESC
                qb.addOrderBy(`${qb.alias}.${field}`.substr(1), "DESC");
            } else {
                qb.addOrderBy(`${qb.alias}.${field}`, "ASC");
            }
        }
    }

    public handleSparseFields(qb: SelectQueryBuilder<any>, props: ObjectLiteral | string, parents: string[] = [], select: string[]) {
        if (typeof props === "string") {
            if (!parents.length) {
                parents = [this.metadata.tableName];
            }

            for (const elem of props.split(",")) {
                select.push(`${parents.join(".")}.${elem}`);
            }
        } else {
            for (const index in props) {
                const property = props[index];
                const copy = parents.slice(); // slice makes a copy
                copy.push(index); // fast way to check if string is number
                this.handleSparseFields(qb, property, copy, select);
            }
        }
    }


    /**
     * Simplified from TypeORM source code
     */
    public handleIncludes(qb: SelectQueryBuilder<any>, allRelations: string[], alias: string, metadata: EntityMetadata, prefix: string,
        applyJoin?: (relation: string, selection: string, relationAlias: string) => undefined | null) {
        let matchedBaseRelations: string[] = [];

        if (prefix) {
            const regexp = new RegExp(`^${ prefix.replace(".", "\\.") }\\.`);
            matchedBaseRelations = allRelations
                .filter((relation) => regexp.exec(relation))
                .map((relation) => relation.replace(regexp, ""))
                .filter((relation) => metadata.findRelationWithPropertyPath(relation));
        } else {
            matchedBaseRelations = allRelations.filter((relation) => metadata.findRelationWithPropertyPath(relation));
        }

        for (const relation of matchedBaseRelations) {
            const relationAlias: string = this.buildAlias(alias, relation);

            // add a join for the found relation
            const selection = `${alias}.${ relation}`;
            if (applyJoin) {
                // if applyJoin returns null , stop executing the applyJoin function
                if (applyJoin(relation, selection, relationAlias) === null) {
                    applyJoin = null;
                }
            }else{
                qb.leftJoinAndSelect(selection, relationAlias);
            }

            // remove added relations from the allRelations array, this is needed to find all not found relations at the end
            allRelations.splice(allRelations.indexOf(prefix ? `${prefix}.${relation}` : relation), 1);

            const join = qb.expressionMap.joinAttributes.find((joinAttr) => joinAttr.entityOrProperty === selection);
            this.handleIncludes(qb, allRelations, join.alias.name, join.metadata, prefix ? `${prefix }.${ relation}` : relation, applyJoin);
        }
    }

    public buildAlias(alias: string, relation: string) {
        return dashify(`${alias }.${ relation}`);
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelationshipsFromRequest(relationName: string, id: string | number, params: JsonApiRequestParams): Promise<any> {
        const thisRelation = this.metadata.findRelationWithPropertyPath(relationName);
        const otherEntity = thisRelation.type as any;
        const otherRepo = ApplicationRegistry.repositoryFor(otherEntity);
        const alias = otherRepo.metadata.tableName;
        const aliasRelation = this.buildAlias(alias, thisRelation.inverseSidePropertyPath);

        if ((await this.count({where : {id}})) === 0) {
            throw Boom.notFound();
        }

        const resultQb = otherRepo.createQueryBuilder(otherRepo.metadata.tableName)
            .select(`${alias}.id`)
            .leftJoin(`${alias}.${thisRelation.inverseSidePropertyPath}`, aliasRelation)
            .where(`${aliasRelation}.id = :id`, {id});

        otherRepo.jsonApiRequest(params, {}, resultQb);

        const result = await (
            thisRelation.isManyToOne || thisRelation.isOneToOne ?
                resultQb.getOne() :
                resultQb.getMany()
        );

        return result;
    }
}