import {Request} from "express";
import * as JSONAPISerializer from "json-api-serializer";
import {ISerialize, SerializerParams} from "@triptyk/nfw-core";
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
    }

    /**
     *
     * @param relationshipType
     * @param payload
     * @param schema
     */
    public serializeRelationships(relationshipType: string, payload: any, schema: string = "default") {
        return this.serializer.serializeRelationship(relationshipType, schema, null, payload);
    }

    /**
     * Deserialize a payload from json-api format
     *
     * @param req
     */
    public deserialize = (req: Request): any => {
        return this.serializer.deserialize(this.type, req.body);
    }

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
    protected replacePage = (url: string, newPage: number): string => {
        return url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);
    }

    protected setupLinks = (data: object, serializerParams: SerializerParams): void => {
        if (serializerParams.hasPaginationEnabled()) {
            const {total, request} = serializerParams.getPaginationData();
            const page = parseInt(request.query.page.number, 10);
            const size = request.query.page.size;
            const baseUrl = `/api/${process.env.API_VERSION}`;
            const max = Math.ceil(total / size);

            data["topLevelLinks"] = {
                first: () => `${baseUrl}/${this.type}${this.replacePage(request.url, 1)}`,
                last: () => `${baseUrl}/${this.type}${this.replacePage(request.url, max)}`,
                next: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page + 1 > max ? max : page + 1)}`,
                prev: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page - 1 < 1 ? page : page - 1)}`,
                self: () => `${baseUrl}/${this.type}${request.url}`
            };
        }

        // link for entity
        data["links"] = {
            self: (d) => {
                return `/api/${process.env.API_VERSION}/${this.type}s/${d.id}`;
            }
        };

        // link for relationship
        for (const key in data["relationships"]) {
            data["relationships"][key]["links"] = {
                related: (d) => {
                    return `/api/${process.env.API_VERSION}/${plural(this.type)}/${d.id}/${key}`;
                },
                self: (d) => {
                    return `/api/${process.env.API_VERSION}/${plural(this.type)}/${d.id}/relationships/${key}`;
                }
            };
        }
    }
}

export {BaseSerializer};
