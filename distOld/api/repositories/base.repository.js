"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const SqlString = require("sqlstring");
const Boom = require("boom");
const Pluralize = require("pluralize");
/**
 * Base Repository class , inherited for all current repositories
 */
class BaseRepository extends typeorm_1.Repository {
    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    jsonApiRequest(query, allowedIncludes = [], { allowIncludes = true, allowSorting = true, allowPagination = true, allowFields = true, allowFilters = false } = {}) {
        const currentTable = this.metadata.tableName;
        const splitAndFilter = (string) => string.split(',').map(e => e.trim()).filter(string => string != ''); //split parameters and filter empty strings
        let queryBuilder = this.createQueryBuilder(currentTable);
        let select = [`${currentTable}.id`];
        /**
         * Check if include parameter exists
         * An endpoint MAY also support an include request parameter to allow the client to customize which related resources should be returned.
         * @ref https://jsonapi.org/format/#fetching-includes
         */
        if (allowIncludes && query.include) {
            let includes = splitAndFilter(query.include);
            includes.forEach((include) => {
                select.push(`${include}.id`); // push to select include , because id is always included
                if (allowedIncludes.indexOf(include) > -1) {
                    let property, alias;
                    if (include.indexOf(".") !== -1) {
                        property = include;
                        let test = include.split(".");
                        alias = Pluralize.isPlural(test[test.length - 1]) ? `${test[0]}.${Pluralize.singular(test[test.length - 1])}` : test[test.length - 1];
                        //we need to singularize the table name for some reasons on the alias or deep includes will not work properly
                    }
                    else {
                        property = `${currentTable}.${include}`;
                        alias = include;
                    }
                    queryBuilder.leftJoinAndSelect(property, alias);
                }
                else {
                    throw Boom.expectationFailed(`Relation with ${include} not authorized`); //TODO : XSS ?
                }
            });
        }
        /**
         * Check if fields parameter exists
         * A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
         * @ref https://jsonapi.org/format/#fetching-sparse-fieldsets
         */
        if (allowFields && query.fields) {
            /**
             * Recursive function to populate select statement with fields array
             */
            let fillFields = (props, parents = []) => {
                if (typeof props === "string") {
                    if (!parents.length)
                        parents = [currentTable];
                    splitAndFilter(props)
                        .forEach(elem => select.push(`${parents.join('.')}.${elem}`));
                }
                else {
                    for (let index in props) {
                        let property = props[index];
                        let copy = parents.slice(); //slice makes a copy
                        if (+index !== +index)
                            copy.push(index); // fast way to check if string is number
                        fillFields(property, copy);
                    }
                }
            };
            fillFields(query.fields);
            queryBuilder.select(select); // select parameters are escaped by default , no need to escape sql string
        }
        /**
         * Check if sort parameter exists
         * A server MAY choose to support requests to sort resource collections according to one or more criteria (“sort fields”).
         * @ref https://jsonapi.org/format/#fetching-sorting
         */
        if (allowSorting && query.sort) {
            let sortFields = splitAndFilter(query.sort); //split parameters and filter empty strings
            // need to use SqlString.escapeId in order to prevent SQL injection on orderBy()
            sortFields.forEach((field) => {
                if (field[0] == "-") { // JSON-API convention , when sort field starts with '-' order is DESC
                    queryBuilder.orderBy(SqlString.escapeId(field.substr(1)), "DESC"); //
                }
                else {
                    queryBuilder.orderBy(SqlString.escapeId(field), "ASC");
                }
            });
        }
        /**
         * Check if pagination is enabled
         * A server MAY choose to limit the number of resources returned in a response to a subset (“page”) of the whole set available.
         * @ref https://jsonapi.org/format/#fetching-pagination
         */
        if (allowPagination && query.page && query.page.number && query.page.size) {
            let number = query.page.number;
            let size = query.page.size;
            queryBuilder
                .skip((number - 1) * size)
                .take(size);
        }
        if (allowFilters && query.filter) {
            let queryBrackets = new typeorm_1.Brackets(qb => {
                for (let key in query.filter) {
                    let filtered = splitAndFilter(query.filter[key]);
                    filtered.forEach((e) => {
                        let [strategy, value] = e.split(":");
                        // TODO : fix params not working with TypeORM where
                        if (strategy == "like") {
                            qb.where(SqlString.format(`?? LIKE ?`, [key, value]));
                        }
                        if (strategy == "eq") {
                            qb.where(SqlString.format(`?? = ?`, [key, value]));
                        }
                        if (strategy == "orlike") {
                            qb.orWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                        }
                        if (strategy == "oreq") {
                            qb.orWhere(SqlString.format(`?? = ?`, [key, value]));
                        }
                    });
                }
            });
            queryBuilder.where(queryBrackets);
        }
        return queryBuilder;
    }
    /**
     * Shortcut function to make a JSON-API findOne request on id key
     */
    jsonApiFindOne(req, id, allowedIncludes = [], options) {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .where(`${this.metadata.tableName}.id = :id`, { id })
            .getOne();
    }
    /**
     * Shortcut function to make a JSON-API findMany request with data used for pagination
     */
    jsonApiFind(req, allowedIncludes = [], options) {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .getManyAndCount();
    }
}
exports.BaseRepository = BaseRepository;
