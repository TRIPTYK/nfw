import {Request} from "express";
import * as JSONAPISerializer from "json-api-serializer";
import {ISerialize} from "../interfaces/ISerialize.interface";
import {api, url} from "../../config/environment.config";
import {SerializerParams} from "./serializerParams";
import { plural } from "pluralize";

abstract class BaseSerializer implements ISerialize {

    public static whitelist: string[] = [];
    public type: string;
    public serializer: JSONAPISerializer;

    /**
     * @param type Entity type
     * @param options
     */
    protected constructor(type: string, options = {}) {
        this.serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase",
            ...options
        });
        this.type = type;
    }

    /**
     * Serialize a payload to json-api format
     *
     * @param payload Payload
     * @param schema
     * @param params
     */
    public serialize = (payload: any, schema = null, params = {}): any => {
        return this.serializer.serialize(this.type, payload, schema, params);
    };

    /**
     *
     * @param relationshipType
     * @param payload
     * @param schema
     */
    public serializeRelationships(relationshipType: string, payload: any, schema: string = 'default') {
        return this.serializer.serializeRelationship(relationshipType, schema, null, payload);
    }

    /**
     * Deserialize a payload from json-api format
     *
     * @param req
     */
    public deserialize = (req: Request): any => {
        return this.serializer.deserialize(this.type, req.body);
    };

    /**
     *
     * @param schema
     */
    public getSchemaData(schema: string = "default") {
        return this.serializer.schemas[this.type][schema];
    }

    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage: Function = (url: string, newPage: number): string => {
        return url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);
    };

    protected setupLinks: Function = (data: object, serializerParams: SerializerParams): void => {
        if (serializerParams.hasPaginationEnabled()) {
            const {total, request} = serializerParams.getPaginationData();
            const page = parseInt(request.query.page.number);
            const size = request.query.page.size;
            const baseUrl = `/api/${api}`;
            const max = Math.ceil(total / size);

            data["topLevelLinks"] = {
                self: () => `${baseUrl}/${this.type}${request.url}`,
                next: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page + 1 > max ? max : page + 1)}`,
                prev: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page - 1 < 1 ? page : page - 1)}`,
                last: () => `${baseUrl}/${this.type}${this.replacePage(request.url, max)}`,
                first: () => `${baseUrl}/${this.type}${this.replacePage(request.url, 1)}`
            }
        }

        // link for entity
        data['links'] = {
            self: (data) => {
                return `/api/${api}/${this.type}s/${data.id}`;
            }
        };

        //link for relationship
        for (let key in data['relationships'])
        {
            data['relationships'][key]['links'] = {
                self: (data) => {
                    return `/api/${api}/${plural(this.type)}/${data.id}/relationships/${key}`;
                },
                related: (data) => {
                    return `/api/${api}/${plural(this.type)}/${data.id}/${key}`;
                }
            }
        }
    };
}

export {BaseSerializer};
