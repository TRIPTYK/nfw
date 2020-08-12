/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as JSONAPISerializer from "json-api-serializer";
import { plural } from "pluralize";
import EnvironmentConfiguration from "../../config/environment.config";
import SerializerInterface from "../../core/interfaces/serializer.interface";

export type SerializerParams = {
    pagination?: PaginationParams;
};

export interface SerializeOptions {
    meta?: object;
    excludeData?: boolean;
    schema?: string | "default";
    overrideSchemaOptions?: JSONAPISerializerOptions;
    paginationData?: PaginationParams;
}

export type PaginationParams = {
    total: number;
    url: string;
    page: number;
    size: number;
};

export type JSONAPISerializerSchema = {
    id?: string;
    type: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?: JSONAPISerializerCustom;
    topLevelMeta?: any;
    topLevelLinks?: any;
    meta?: JSONAPISerializerCustom;
    relationships?: { [key: string]: JSONAPISerializerSchema };
    convertCase?: "kebab-case" | "snake_case" | "camelCase";
    unconvertCase?: "kebab-case" | "snake_case" | "camelCase";
    blacklistOnDeserialize?: string[];
    whitelistOnDeserialize?: string[];
};

export type JSONAPISerializerCustom = string | ((arg1?: object, arg2?: object) => object | string);

export type JSONAPISerializerRelation = {
    type: JSONAPISerializerCustom;
    alternativeKey?: string;
    schema?: string;
    links?: JSONAPISerializerCustom;
    meta?: JSONAPISerializerCustom;
    deserialize?: JSONAPISerializerCustom;
};

export type JSONAPISerializerOptions = {
    id?: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?: JSONAPISerializerCustom;
    topLevelMeta?: any;
    topLevelLinks?: any;
    meta?: JSONAPISerializerCustom;
    relationships?: { [key: string]: JSONAPISerializerRelation };
    convertCase?: "kebab-case" | "snake_case" | "camelCase";
    // unconvert
    unconvertCase?: "kebab-case" | "snake_case" | "camelCase";
    blacklistOnDeserialize?: string[];
    whitelistOnDeserialize?: string[];
};

export abstract class BaseSerializer<T> implements SerializerInterface<T> {
    public static whitelist: string[] = [];
    public type: string;
    public schema: JSONAPISerializerSchema;
    public serializer: JSONAPISerializer;

    protected constructor(schema: JSONAPISerializerSchema) {
        this.serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        } as JSONAPISerializerSchema);

        this.type = schema.type;
        this.schema = schema;

        this.registerFromSchema(schema);
    }

    public serializeAsync(payload: T | T[], options?: SerializeOptions): any {
        if (options.paginationData) {
            const { total, url, page , size } = options.paginationData;
            const { api } = EnvironmentConfiguration.config;
            const baseUrl = `/api/${api.version}`;
            const max = Math.ceil(total / size);
            delete options.paginationData;
            options.overrideSchemaOptions = {
                topLevelLinks : {
                    first: () => `${baseUrl}/${this.type}${this.replacePage(url, 1)}`,
                    last: () => `${baseUrl}/${this.type}${this.replacePage(url, max)}`,
                    next: () => `${baseUrl}/${this.type}${this.replacePage(url, page + 1 > max ? max : page + 1)}`,
                    prev: () => `${baseUrl}/${this.type}${this.replacePage(url, page - 1 < 1 ? page : page - 1)}`,
                    self: () => `${baseUrl}/${this.type}${url}`
                },
                topLevelMeta : {
                    max,
                    page,
                    size,
                    total
                }
            };
        }

        return this.serializer.serializeAsync(this.type, payload, options?.schema, options?.meta , options?.excludeData, {
            [this.type] : options?.overrideSchemaOptions
        });
    }

    public deserializeAsync(payload: any): T | T[] {
        return this.serializer.deserializeAsync(this.type, payload);
    }

    public serialize(payload: T | T[], options?: SerializeOptions): any {
        if (options.paginationData) {
            const { total, url, page , size } = options.paginationData;
            const { api } = EnvironmentConfiguration.config;
            const baseUrl = `/api/${api.version}`;
            const max = Math.ceil(total / size);
            delete options.paginationData;
            options.overrideSchemaOptions = {
                topLevelLinks : {
                    first: () => `${baseUrl}/${this.type}${this.replacePage(url, 1)}`,
                    last: () => `${baseUrl}/${this.type}${this.replacePage(url, max)}`,
                    next: () => `${baseUrl}/${this.type}${this.replacePage(url, page + 1 > max ? max : page + 1)}`,
                    prev: () => `${baseUrl}/${this.type}${this.replacePage(url, page - 1 < 1 ? page : page - 1)}`,
                    self: () => `${baseUrl}/${this.type}${url}`
                },
                topLevelMeta : {
                    max,
                    page,
                    size,
                    total
                }
            };
        }

        return this.serializer.serialize(this.type, payload,options?.schema, options?.meta , options?.excludeData, {
            [this.type] : options?.overrideSchemaOptions
        });
    }

    public deserialize(payload: any): T | T[] {
        return this.serializer.deserialize(this.type, payload);
    }

    public registerFromSchema(schema: JSONAPISerializerSchema): void {
        const relationShips: { [key: string]: JSONAPISerializerRelation } = {};

        for (const key in schema.relationships) {
            if (schema.relationships[key]) {
                relationShips[key] = {
                    type : schema.relationships[key].type
                };
                this.registerFromSchema(schema.relationships[key]);
            }
        }

        this.serializer.register(schema.type, {...schema, ...{relationships : relationShips}});
    }

    public setupPaginationLinks(paginationParams: PaginationParams): this {
        const { api } = EnvironmentConfiguration.config;
        const { total, url, page , size } = paginationParams;
        const baseUrl = `/api/${api}`;
        const max = Math.ceil(total / size);
        const schema = this.getSchemaData();


        schema["topLevelMeta"] = {
            max,
            page,
            size,
            total
        };

        schema["topLevelLinks"] = {
            first: () => `${baseUrl}/${this.type}${this.replacePage(url, 1)}`,
            last: () => `${baseUrl}/${this.type}${this.replacePage(url, max)}`,
            next: () => `${baseUrl}/${this.type}${this.replacePage(url, page + 1 > max ? max : page + 1)}`,
            prev: () => `${baseUrl}/${this.type}${this.replacePage(url, page - 1 < 1 ? page : page - 1)}`,
            self: () => `${baseUrl}/${this.type}${url}`
        };

        return this;
    }

    /**
     *
     * @param schema
     */
    public getSchemaData(schema = "default"): any {
        return this.serializer.schemas[this.type][schema];
    }

    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage = (url: string, newPage: number): string =>
        url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);

    protected setupLinks = (data: object): void => {
        const { api } = EnvironmentConfiguration.config;

        // link for entity
        data["links"] = {
            self: (d) => `/api/${api}/${this.type}s/${d.id}`
        };

        // link for relationship
        for (const key in data["relationships"]) {
            data["relationships"][key]["links"] = {
                related: (d) => `/api/${api}/${plural(this.type)}/${d.id}/${key}`,
                self: (d) => `/api/${api}/${plural(this.type)}/${d.id}/relationships/${key}`
            };
        }
    }
}
