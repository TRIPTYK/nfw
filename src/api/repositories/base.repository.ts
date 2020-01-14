import {Brackets, EntityRepository, Repository, SelectQueryBuilder} from "typeorm";
import * as SqlString from "sqlstring";
import {Request} from "express";
import Boom from "@hapi/boom";
import * as dashify from "dashify";
import * as JSONAPISerializer from "json-api-serializer";
import { isPlural } from "pluralize";
import {JsonApiRepositoryInterface} from "@triptyk/nfw-core";
import { BaseSerializer } from "../serializers/base.serializer";


/**
 * Base Repository class , inherited for all current repositories
 */
@EntityRepository()
class BaseRepository<T> extends Repository<T> implements JsonApiRepositoryInterface<T> {

    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    public jsonApiRequest(query: any, allowedIncludes: string[] = [],
        {allowIncludes = true, allowSorting = true, allowPagination = true, allowFields = true, allowFilters = false}:
        {allowIncludes?: boolean, allowSorting?: boolean, allowPagination?: boolean, allowFields?: boolean,
            allowFilters?: boolean } = {}
    ): SelectQueryBuilder<T> {
        const currentTable = this.metadata.tableName;
        const splitAndFilter = (string: string, symbol: string) => string
            .split(symbol)
            .map((e) => e.trim()).filter((str) => str !== "");  // split parameters and filter empty strings

        const queryBuilder = this.createQueryBuilder(currentTable);
        const select: string[] = [`${currentTable}.id`];

        /**
         * Check if include parameter exists
         * An endpoint MAY also support an include request parameter
         * to allow the client to customize which related resources should be returned.
         * @ref https://jsonapi.org/format/#fetching-includes
         */
        if (allowIncludes && query.include) {
            const includes = splitAndFilter(query.include, ",");
            const noDashDotIncludes = allowedIncludes.map((i) => i.replace(/-|\./g, ""));

            for (const include of includes) {
                select.push(`${include}.id`); // push to select include , because id is always included

                const noDashDotInclude = include.replace(/-|\./g, "");

                // insensitive check of dash-dot includes for aliases
                if (noDashDotIncludes.indexOf(noDashDotInclude) !== -1) {

                    let property: string;
                    let alias: string;

                    if (include.indexOf(".") !== -1) {
                        property = include;
                    } else {
                        property = `${currentTable}.${include}`;
                    }

                    alias = dashify(include);

                    queryBuilder.leftJoinAndSelect(property, alias);
                } else {
                    throw Boom.expectationFailed(`Relation with ${include} not authorized`);
                }
            }
        }


        /**
         * Check if fields parameter exists
         * A client MAY request that an endpoint return only specific fields
         * in the response on a per-type basis by including a fields[TYPE] parameter.
         * @ref https://jsonapi.org/format/#fetching-sparse-fieldsets
         */
        if (allowFields && query.fields) {
            /**
             * Recursive function to populate select statement with fields array
             */
            const fillFields = (props: object | string, parents: string[] = []) => {
                if (typeof props === "string") {
                    if (!parents.length) {
                        parents = [currentTable];
                    }

                    for (const elem of splitAndFilter(props, ",")) {
                        select.push(`${parents.join(".")}.${elem}`);
                    }
                } else {
                    for (const index in props) {
                        const property = props[index];
                        const copy = parents.slice(); // slice makes a copy
                        if (+index !== +index) {
                            copy.push(index); // fast way to check if string is number
                        }
                        fillFields(property, copy);
                    }
                }
            };

            fillFields(query.fields);
            queryBuilder.select(select); // select parameters are escaped by default , no need to escape sql string
        }


        /**
         * Check if sort parameter exists
         * A server MAY choose to support requests to sort
         * resource collections according to one or more criteria (“sort fields”).
         * @ref https://jsonapi.org/format/#fetching-sorting
         */
        if (allowSorting && query.sort) {
            const sortFields = splitAndFilter(query.sort, ","); // split parameters and filter empty strings

            // need to use SqlString.escapeId in order to prevent SQL injection on orderBy()
            for (const field of sortFields) {
                if (field[0] === "-") {  // JSON-API convention , when sort field starts with '-' order is DESC
                    queryBuilder.orderBy(SqlString.escapeId(field.substr(1)), "DESC");
                } else {
                    queryBuilder.orderBy(SqlString.escapeId(field), "ASC");
                }
            }
        }


        /**
         * Check if pagination is enabled
         * A server MAY choose to limit the number of resources
         * returned in a response to a subset (“page”) of the whole set available.
         * @ref https://jsonapi.org/format/#fetching-pagination
         */
        if (allowPagination && query.page && query.page.number && query.page.size) {
            const {number, size} = query.page;

            queryBuilder
                .skip((number - 1) * size)
                .take(size);
        }

        if (allowFilters && query.filter) {
            // put everything into sub brackets to not interfere with more important search params
            const queryBrackets = new Brackets((qb) => {
                for (const key in query.filter) {
                    const filtered: string[] = splitAndFilter(query.filter[key], ",");
                    for (const e of filtered) {
                        const [strategy, value] = e.split(":");

                        // TODO : fix params not working with TypeORM where
                        switch (strategy) {
                            case "like" :
                                qb.andWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                                break ;
                            case "eq" :
                                qb.andWhere(SqlString.format(`?? = ?`, [key, value]));
                                break ;
                            case "noteq" :
                                qb.andWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                                break ;
                            case "andin":
                                qb.andWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilter(value, "+")]));
                                break ;
                            case "notin" :
                                qb.andWhere(SqlString.format(`?? NOT IN (?)`, [key, splitAndFilter(value, "+")]));
                                break ;
                            case "orlike" :
                                qb.orWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                                break ;
                            case "oreq" :
                                qb.orWhere(SqlString.format(`?? = ?`, [key, value]));
                                break ;
                            case "ornoteq" :
                                qb.orWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                                break ;
                            case "orin" :
                                qb.orWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilter(value, "+")]));
                                break ;
                            case "orbtw":
                                const orvalues = splitAndFilter(value, "+");
                                if (orvalues.length !== 2) { throw Boom.badRequest("Must have 2 values in between filter"); }
                                qb.orWhere(SqlString.format(`?? BETWEEN ? AND ?`, [key, orvalues[0], orvalues[1]]));
                                break ;
                            case "andbtw":
                                const andvalues = splitAndFilter(value, "+");
                                if (andvalues.length !== 2) { throw Boom.badRequest("Must have 2 values in between filter"); }
                                qb.andWhere(SqlString.format(`?? BETWEEN ? AND ?`, [key, andvalues[0], andvalues[1]]));
                                break ;
                            case "andsuporeq":
                                qb.andWhere(SqlString.format(`?? >= ?`, [key, value]));
                                break;
                            case "orsuporeq":
                                qb.orWhere(SqlString.format(`?? >= ?`, [key, value]));
                                break;
                            case "andlessoreq":
                                qb.andWhere(SqlString.format(`?? <= ?`, [key, value]));
                                break;
                            case "orlessoreq":
                                qb.orWhere(SqlString.format(`?? <= ?`, [key, value]));
                                break;
                        }
                    }
                }
            });
            queryBuilder.where(queryBrackets);
        }

        return queryBuilder;
    }


    /**
     * Shortcut function to make a JSON-API findOne request on id key
     */
    public jsonApiFindOne(req: Request, id: any, allowedIncludes: string[] = [], options?:
        { allowIncludes?: boolean; allowSorting?: boolean;
            allowPagination?: boolean; allowFields?: boolean; allowFilters?: boolean; }
    ): Promise<T> {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .where(`${this.metadata.tableName}.id = :id`, {id})
            .getOne();
    }

    /**
     * Shortcut function to make a JSON-API findMany request with data used for pagination
     */
    public jsonApiFind(req: Request, allowedIncludes: string[] = [], options?:
        { allowIncludes?: boolean; allowSorting?: boolean;
            allowPagination?: boolean; allowFields?: boolean; allowFilters?: boolean; }
    ): Promise<[T[], number]> {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .getManyAndCount();
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelated(req: Request, serializer: BaseSerializer) {
        const { id , relation } = req.params;
        let type = serializer.getSchemaData()["relationships"];

        if (!type[relation]) {
            throw Boom.notFound("Relation not found");
        }
        type = type[relation]["type"];

        let serializerImport = await import(`../serializers/${type}.serializer`);
        serializerImport = Object.values(serializerImport)[0];

        const rel = await this.findOne(id, {relations : [relation]});

        if (!rel) {
            throw Boom.notFound();
        }

        return new serializerImport().serialize(rel[relation]);
    }

    /**
     *
     * @param req
     */
    public async addRelationshipsFromRequest(req: Request)  {
        const {id, relation} = req.params;
        const user = await this.findOne(id);

        if (!user) {
            throw Boom.notFound();
        }

        const serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);

        let relations = null;

        if (Array.isArray(req.body)) {
            relations = [];
            for (const value of req.body) {
                relations.push(value.id);
            }
        } else {
            relations = req.body.id;
        }

        const qb =  this.createQueryBuilder()
            .relation(relation)
            .of(user);

        if (isPlural(relation)) {
            return qb.add(relations);
        } else {
            return qb.set(relations);
        }
    }

    /**
     *
     * @param req
     */
    public async updateRelationshipsFromRequest(req: Request) {
        const {id, relation} = req.params;
        const user = await this.findOne(id);

        if (!user) {
            throw Boom.notFound();
        }

        const serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);

        let relations = null;

        if (Array.isArray(req.body)) {
            relations = [];
            for (const value of req.body) {
                relations.push(value.id);
            }
        } else {
            relations = req.body.id;
        }

        user[relation] = await (isPlural(relation) ?
            this.findByIds(relations) :
            this.findOne(relations));

        return this.save(user);
    }

    /**
     *
     * @param req
     */
    public async removeRelationshipsFromRequest(req: Request) {
        const {id, relation} = req.params;
        const user = await this.findOne(id);

        if (!user) {
            throw Boom.notFound();
        }

        const serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);

        let relations = null;

        if (Array.isArray(req.body)) {
            relations = [];
            for (const value of req.body) {
                relations.push(value.id);
            }
        } else {
            relations = req.body.id;
        }

        const qb = this.createQueryBuilder()
            .relation(relation)
            .of(user);

        if (isPlural(relation)) {
            return qb.remove(relations);
        } else {
            return qb.set(null);
        }
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelationshipsFromRequest(req: Request, serializer: BaseSerializer) {
        const {id, relation} = req.params;

        const user = await this.createQueryBuilder("relationQb")
            .leftJoin(`relationQb.${relation}`, "relation")
            .select(["relationQb.id", "relation.id"])
            .where("relationQb.id = :id", {id})
            .getOne();

        if (!user) {
            throw Boom.notFound();
        }

        const serialized = serializer.serialize(user);
        return serialized["data"]["relationships"][relation];
    }
}

export {BaseRepository};
