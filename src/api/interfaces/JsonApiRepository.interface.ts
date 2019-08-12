import {SelectQueryBuilder} from "typeorm";
import {BaseSerializer} from "../serializers/base.serializer";
import {Request} from "express";

interface JsonApiRepositoryInterface<T> {
    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    jsonApiRequest(query: any, allowedIncludes: Array<string>, {allowIncludes, allowSorting, allowPagination, allowFields, allowFilters}: { allowIncludes?: boolean, allowSorting?: boolean, allowPagination?: boolean, allowFields?: boolean, allowFilters?: boolean }
    ): SelectQueryBuilder<T>;


    /**
     * Shortcut function to make a JSON-API findOne request on id key
     */
    jsonApiFindOne(req: Request, id: any, allowedIncludes: Array<string>, options?: { allowIncludes?: boolean; allowSorting?: boolean; allowPagination?: boolean; allowFields?: boolean; allowFilters?: boolean; }): Promise<T>;

    /**
     * Shortcut function to make a JSON-API findMany request with data used for pagination
     */
    jsonApiFind(req: Request, allowedIncludes: Array<string>, options?: { allowIncludes?: boolean; allowSorting?: boolean; allowPagination?: boolean; allowFields?: boolean; allowFilters?: boolean; }): Promise<[T[], number]>;

    /**
     *
     * @param req
     * @param serializer
     */
    fetchRelated(req : Request,serializer : BaseSerializer);

    /**
     *
     * @param req
     */
    addRelationshipsFromRequest(req: Request);

    /**
     *
     * @param req
     */
    updateRelationshipsFromRequest(req: Request);

    /**
     *
     * @param req
     */
    removeRelationshipsFromRequest(req: Request);

    /**
     *
     * @param req
     * @param serializer
     */
    fetchRelationshipsFromRequest(req: Request,serializer : BaseSerializer);
}

export {JsonApiRepositoryInterface};