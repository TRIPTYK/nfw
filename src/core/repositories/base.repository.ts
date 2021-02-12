import * as Boom from "@hapi/boom";
import * as dashify from "dashify";
import * as Sqlstring from "sqlstring";
import {
    Brackets,
    EntityMetadata,
    Repository,
    SelectQueryBuilder,
    WhereExpression
} from "typeorm";
import { ApplicationRegistry } from "../application/registry.application";
import PaginationQueryParams from "../types/jsonapi";

interface JsonApiRequestParams {
    includes?: string[];
    sort?: string[];
    fields?: Record<string, any>;
    page?: PaginationQueryParams;
    filter?: any;
}

interface FilterConditionBlock {
    value: string;
    operator:
        | "eq"
        | "in"
        | "gt"
        | "lt"
        | "not-eq"
        | "not-in"
        | "not-gt"
        | "not-lt";
    path: string;
    conjunction?: "and" | "or";
}

interface FilterBlock {
    block: (FilterConditionBlock | FilterBlock)[];
    conjunction?: "and" | "or";
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
        {
            allowIncludes = true,
            allowSorting = true,
            allowPagination = true,
            allowFields = true,
            allowFilters = true
        }: {
            allowIncludes?: boolean;
            allowSorting?: boolean;
            allowPagination?: boolean;
            allowFields?: boolean;
            allowFilters?: boolean;
        } = {},
        parentQueryBuilder?: SelectQueryBuilder<T>
    ): SelectQueryBuilder<T> {
        const currentTable = this.metadata.tableName;

        const queryBuilder = parentQueryBuilder
            ? parentQueryBuilder
            : this.createQueryBuilder(currentTable);
        const select: string[] = [`${currentTable}.id`];

        /**
         * Check if include parameter exists
         * An endpoint MAY also support an include request parameter
         * to allow the client to customize which related resources should be returned.
         * @ref https://jsonapi.org/format/#fetching-includes
         */
        if (allowIncludes && params.includes) {
            this.handleIncludes(
                queryBuilder,
                params.includes,
                currentTable,
                this.metadata,
                ""
            );
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
                number: params.page.number,
                size: params.page.size
            });
        }

        if (allowFilters && params.filter) {
            // put everything into sub brackets to not interfere with more important search params
            this.applyFilter(params.filter, queryBuilder);
        }

        console.log(queryBuilder.getSql());

        return queryBuilder;
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelated(
        relationName: string,
        id: string | number,
        params: JsonApiRequestParams
    ): Promise<any> {
        const thisRelation = this.metadata.findRelationWithPropertyPath(
            relationName
        );

        if (!thisRelation) {
            throw Boom.notFound();
        }

        const otherEntity = thisRelation.type as any;
        const otherRepo = ApplicationRegistry.repositoryFor(otherEntity);
        const alias = otherRepo.metadata.tableName;
        const aliasRelation = this.buildAlias(
            // build an unusable alias, just need it to fetch the relation
            thisRelation.inverseSidePropertyPath,
            thisRelation.inverseSidePropertyPath
        );

        if ((await this.findOne({ where: { id } })) === undefined) {
            throw Boom.notFound();
        }

        const resultQb = otherRepo
            .createQueryBuilder(otherRepo.metadata.tableName)
            .innerJoin(
                // innerjoin, if not exists returns empty
                `${alias}.${thisRelation.inverseSidePropertyPath}`,
                aliasRelation
            )
            .where(`${aliasRelation}.id = :id`, { id });

        otherRepo.jsonApiRequest(params, {}, resultQb);

        const result = await (thisRelation.isManyToOne ||
        thisRelation.isOneToOne
            ? resultQb.getOne()
            : resultQb.getMany());

        return result;
    }

    private applyConditionBlock(
        block: FilterConditionBlock,
        we: WhereExpression
    ) {
        block.conjunction ??= "and";
        block.operator ??= "eq";

        let queryString = "";
        let queryParams = {};
        const varName = `${block.operator}${block.value}`;
        const propertyName = `${Sqlstring.format(block.path)}`;

        switch (block.operator) {
            case "eq":
                queryString = `${propertyName} = :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            case "not-eq":
                queryString = `${propertyName} != :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            case "not-in":
                queryString = `NOT ${propertyName} IN (:${varName})`;
                queryParams = { [varName]: block.value };
                break;
            case "in":
                queryString = `${propertyName} IN (:${varName})`;
                queryParams = { [varName]: block.value };
                break;
            case "lt":
                queryString = `${propertyName} < :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            case "not-lt":
                queryString = `NOT ${propertyName} < :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            case "not-gt":
                queryString = `NOT ${propertyName} > :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            case "gt":
                queryString = `${propertyName} > :${varName}`;
                queryParams = { [varName]: block.value };
                break;
            default:
                break;
        }

        switch (block.conjunction) {
            case "and":
                we.andWhere(queryString, queryParams);
                break;
            case "or":
                we.orWhere(queryString, queryParams);
                break;
            default:
                break;
        }
    }

    private applyFilter(
        queryBlock: FilterBlock | (FilterConditionBlock | FilterBlock)[],
        we: WhereExpression | SelectQueryBuilder<T>
    ) {
        const conjunction = queryBlock["conjunction"] ?? "and";
        const brackets = new Brackets((qb) => {
            let blocks: (FilterConditionBlock | FilterBlock)[];

            if (Array.isArray(queryBlock)) {
                blocks = queryBlock;
            } else if (queryBlock.block) {
                blocks = queryBlock.block;
            } else if (typeof queryBlock === "object") {
                blocks = [queryBlock];
            } else {
                throw new Error("Wrong filter syntax");
            }

            for (const iterator of blocks) {
                if ((iterator as FilterBlock).block) {
                    this.applyFilter(iterator as FilterBlock, qb);
                } else {
                    this.applyConditionBlock(
                        iterator as FilterConditionBlock,
                        qb
                    );
                }
            }
        });

        switch (conjunction) {
            case "and":
                we.andWhere(brackets);
                break;
            case "or":
                we.orWhere(brackets);
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param req
     */
    public async addRelationshipsFromRequest(
        relationName: string,
        id: string | number,
        body: { id: string }[] | { id: string }
    ): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(
            relationName
        );

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            relations = [];
            for (const value of body as { id: string }[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as { id: string }).id;
        }

        const qb = this.createQueryBuilder().relation(relationName).of(user);

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            return qb.add(relations);
        }
        return qb.set(relations);
    }

    /**
     *
     * @param req
     */
    public async updateRelationshipsFromRequest(
        relationName: string,
        id: string | number,
        body: { id: string }[] | { id: string }
    ): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(
            relationName
        );

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;
        const isMany = thisRelation.isManyToMany || thisRelation.isOneToMany;

        if (isMany) {
            relations = [];
            for (const value of body as { id: string }[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as { id: string }).id;
        }

        user[relationName] = isMany ? [] : null;
        await this.save(user);

        const qb = this.createQueryBuilder().relation(relationName).of(user);

        if (isMany) {
            return qb.add(relations);
        }
        return qb.set(relations);
    }

    /**
     *
     * @param req
     */
    public async removeRelationshipsFromRequest(
        relationName: string,
        id: string | number,
        body: { id: string }[] | { id: string }
    ): Promise<any> {
        const user = await this.findOne(id);
        const thisRelation = this.metadata.findRelationWithPropertyPath(
            relationName
        );

        if (!user || !thisRelation) {
            throw Boom.notFound();
        }

        let relations = null;

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            relations = [];
            for (const value of body as { id: string }[]) {
                relations.push(value.id);
            }
        } else {
            relations = (body as { id: string }).id;
        }

        const qb = this.createQueryBuilder().relation(relationName).of(user);

        if (thisRelation.isManyToMany || thisRelation.isOneToMany) {
            return qb.remove(relations);
        }
        return qb.set(null);
    }

    public handlePagination(
        qb: SelectQueryBuilder<any>,
        { number, size }: PaginationQueryParams
    ) {
        qb.skip((number - 1) * number).take(size);
    }

    public handleSorting(qb: SelectQueryBuilder<any>, sort: string[]) {
        for (const field of sort) {
            if (field.startsWith("-")) {
                // JSON-API convention , when sort field starts with '-' order is DESC
                qb.addOrderBy(`${qb.alias}.${field}`.substr(1), "DESC");
            } else {
                qb.addOrderBy(`${qb.alias}.${field}`, "ASC");
            }
        }
    }

    public handleSparseFields(
        qb: SelectQueryBuilder<any>,
        props: Record<string, any> | string,
        parents: string[] = [],
        select: string[]
    ) {
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
    public handleIncludes(
        qb: SelectQueryBuilder<any>,
        allRelations: string[],
        alias: string,
        metadata: EntityMetadata,
        prefix: string,
        applyJoin?: (
            relation: string,
            selection: string,
            relationAlias: string
        ) => undefined | null
    ) {
        let matchedBaseRelations: string[] = allRelations;

        if (prefix) {
            const regexp = new RegExp(`^${prefix.replace(".", "\\.")}\\.`);
            matchedBaseRelations = allRelations
                .filter((relation) => regexp.exec(relation))
                .map((relation) => relation.replace(regexp, ""));
        }

        for (const baseRel of matchedBaseRelations) {
            if (!metadata.findRelationWithPropertyPath(baseRel)) {
                throw Boom.badRequest(`Relation ${baseRel} does not exist`);
            }
        }

        for (const relation of matchedBaseRelations) {
            const relationAlias: string = this.buildAlias(alias, relation);

            // add a join for the found relation
            const selection = `${alias}.${relation}`;
            if (applyJoin) {
                // if applyJoin returns null , stop executing the applyJoin function
                if (applyJoin(relation, selection, relationAlias) === null) {
                    applyJoin = null;
                }
            } else {
                qb.leftJoinAndSelect(selection, relationAlias);
            }

            // remove added relations from the allRelations array, this is needed to find all not found relations at the end
            allRelations.splice(
                allRelations.indexOf(
                    prefix ? `${prefix}.${relation}` : relation
                ),
                1
            );

            const join = qb.expressionMap.joinAttributes.find(
                (joinAttr) => joinAttr.entityOrProperty === selection
            );
            this.handleIncludes(
                qb,
                allRelations,
                join.alias.name,
                join.metadata,
                prefix ? `${prefix}.${relation}` : relation,
                applyJoin
            );
        }
    }

    public buildAlias(alias: string, relation: string) {
        return dashify(`${alias}.${relation}`);
    }

    /**
     *
     * @param req
     * @param serializer
     */
    public async fetchRelationshipsFromRequest(
        relationName: string,
        id: string | number,
        params: JsonApiRequestParams
    ): Promise<any> {
        const thisRelation = this.metadata.findRelationWithPropertyPath(
            relationName
        );
        const otherEntity = thisRelation.type as any;
        const otherRepo = ApplicationRegistry.repositoryFor(otherEntity);
        const alias = otherRepo.metadata.tableName;
        const aliasRelation = this.buildAlias(
            alias,
            thisRelation.inverseSidePropertyPath
        );

        if ((await this.count({ where: { id } })) === 0) {
            throw Boom.notFound();
        }

        const resultQb = otherRepo
            .createQueryBuilder(otherRepo.metadata.tableName)
            .select(`${alias}.id`)
            .leftJoin(
                `${alias}.${thisRelation.inverseSidePropertyPath}`,
                aliasRelation
            )
            .where(`${aliasRelation}.id = :id`, { id });

        otherRepo.jsonApiRequest(params, {}, resultQb);

        const result = await (thisRelation.isManyToOne ||
        thisRelation.isOneToOne
            ? resultQb.getOne()
            : resultQb.getMany());

        return result;
    }
}
