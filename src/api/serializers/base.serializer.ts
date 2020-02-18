import {Request} from "express";
import * as JSONAPISerializer from "json-api-serializer";
import { plural } from "pluralize";
import EnvironmentConfiguration from "../../config/environment.config";
import ISerializer from "../../core/interfaces/serializer.interface";
import * as rfdc from "rfdc";

export type SerializerParams = {
    pagination?: PaginationParams
};

export type PaginationParams = {
    total: number,
    url: string,
    page: number,
    size: number
};

export type JSONAPISerializerSchema = {
    id?: string,
    type: string,
    blacklist?: string[],
    whitelist?: string[],
    jsonapiObject?: boolean,
    links?: JSONAPISerializerCustom,
    topLevelMeta?: JSONAPISerializerCustom,
    topLevelLinks?: JSONAPISerializerCustom,
    meta?: JSONAPISerializerCustom,
    relationships?: { [key: string]: JSONAPISerializerSchema },
    convertCase?: "kebab-case" | "snake_case" | "camelCase",
    unconvertCase?: "kebab-case" | "snake_case" | "camelCase",
    blacklistOnDeserialize?: string[],
    whitelistOnDeserialize?: string[]
};

export type JSONAPISerializerCustom = string | ((arg1?: object, arg2?: object) => object | string);

export type JSONAPISerializerRelation = {
    type: JSONAPISerializerCustom,
    alternativeKey?: string,
    schema?: string,
    links?: JSONAPISerializerCustom,
    meta?: JSONAPISerializerCustom,
    deserialize?: JSONAPISerializerCustom
};

export type JSONAPISerializerOptions = {
    id?: string
    blacklist?: string[],
    whitelist?: string[],
    jsonapiObject?: boolean,
    links?: JSONAPISerializerCustom,
    topLevelMeta?: JSONAPISerializerCustom,
    topLevelLinks?: JSONAPISerializerCustom,
    meta?: JSONAPISerializerCustom,
    relationships?: { [key: string]: JSONAPISerializerRelation },
    convertCase?: "kebab-case" | "snake_case" | "camelCase",
    // unconvert
    unconvertCase?: "kebab-case" | "snake_case" | "camelCase",
    blacklistOnDeserialize?: string[],
    whitelistOnDeserialize?: string[]
};

export abstract class BaseSerializer implements ISerializer {
    public static whitelist: string[] = [];
    public type: string;
    public serializer: JSONAPISerializer;

    /**
     * @param type Entity type
     * @param options
     */
    protected constructor(schema: JSONAPISerializerSchema) {
        this.serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        } as JSONAPISerializerSchema);

        this.type = schema.type;

        this.serializer.register(schema.type, schema);
        this.registerFromSchema(schema);
    }

    /**
     * 
     */
    public registerFromSchema(schema: any) {
        const relationShips: { [key: string]: JSONAPISerializerRelation } = {};
        const schemaCopy = rfdc({ proto : true , circles : true})(schema);

        for (const key in schema.relationships) {
            if (schema.relationships[key]) {
                relationShips[key] = {
                    type : schema.relationships[key].type
                };
            }
        }

        schemaCopy.relationships = relationShips;
        for (const key in schemaCopy.relationships) {
            if (schemaCopy.relationships[key]) {
                this.serializer.register(schemaCopy.relationships[key].type, schemaCopy.relationships[key]);
                this.registerFromSchema(schemaCopy.relationships);
            }
        }
    }

    /**
     *
     * @param paginationParams
     */
    public setupPaginationLinks(paginationParams: PaginationParams): this {
        const { api } = EnvironmentConfiguration.config;
        const { total, url, page , size } = paginationParams;
        const baseUrl = `/api/${api}`;
        const max = Math.ceil(total / size);

        this.getSchemaData()["topLevelLinks"] = {
            first: () => `${baseUrl}/${this.type}${this.replacePage(url, 1)}`,
            last: () => `${baseUrl}/${this.type}${this.replacePage(url, max)}`,
            next: () => `${baseUrl}/${this.type}${this.replacePage(url, page + 1 > max ? max : page + 1)}`,
            prev: () => `${baseUrl}/${this.type}${this.replacePage(url, page - 1 < 1 ? page : page - 1)}`,
            self: () => `${baseUrl}/${this.type}${url}`
        };

        return this;
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

    protected setupLinks = (data: object): void => {
        const { api } = EnvironmentConfiguration.config;

        // link for entity
        data["links"] = {
            self: (d) => {
                return `/api/${api}/${this.type}s/${d.id}`;
            }
        };

        // link for relationship
        for (const key in data["relationships"]) {
            data["relationships"][key]["links"] = {
                related: (d) => {
                    return `/api/${api}/${plural(this.type)}/${d.id}/${key}`;
                },
                self: (d) => {
                    return `/api/${api}/${plural(this.type)}/${d.id}/relationships/${key}`;
                }
            };
        }
    }
}
