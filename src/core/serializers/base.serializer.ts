/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as JSONAPISerializer from "json-api-serializer";
import { plural } from "pluralize";
import EnvironmentConfiguration from "../../config/environment.config";
import SerializerInterface from "../interfaces/serializer.interface";
import { SchemaOptions } from "../decorators/serializer.decorator";
import { Type } from "../types/global";

export type SerializerParams = {
    pagination?: PaginationParams;
};

export interface SerializeOptions {
    meta?: object;
    url: string;
    excludeData?: boolean;
    schema?: string | "default";
    overrideSchemaOptions?: JSONAPISerializerOptions;
    paginationData?: PaginationParams;
}

export type PaginationParams = {
    total: number;
    page: number;
    size: number;
};

export type JSONAPISerializerSchema = {
    id?: string;
    type: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?: any;
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
    links?: any;
    meta?: JSONAPISerializerCustom;
    deserialize?: JSONAPISerializerCustom;
};

export type JSONAPISerializerOptions = {
    id?: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?: any;
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
    public serializer: JSONAPISerializer;

    public constructor() {
        this.serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        } as JSONAPISerializerSchema);

        const schemasData: SchemaOptions = Reflect.getMetadata("schemas",this);

        this.type = schemasData.type;

        for (const schema of schemasData.schemas) {
            this.convertSerializerSchemaToObjectSchema(schema,schema,Reflect.getMetadata("name",schema));
        }
    }

    public serializeAsync(payload: T | T[], options: SerializeOptions): any {
        const { api } = EnvironmentConfiguration.config;

        if (options?.paginationData) {
            const { total, page , size } = options.paginationData;
            const baseUrl = `/api/${api.version}`;
            const max = Math.ceil(total / size);
            delete options.paginationData;
            options.overrideSchemaOptions = {
                topLevelLinks : {
                    first: () => `${baseUrl}/${this.type}${this.replacePage(options.url, 1)}`,
                    last: () => `${baseUrl}/${this.type}${this.replacePage(options.url, max)}`,
                    next: () => `${baseUrl}/${this.type}${this.replacePage(options.url, page + 1 > max ? max : page + 1)}`,
                    prev: () => `${baseUrl}/${this.type}${this.replacePage(options.url, page - 1 < 1 ? page : page - 1)}`,
                    self: () => `${baseUrl}/${this.type}${options.url}`
                },
                topLevelMeta : {
                    max,
                    page,
                    size,
                    total
                }
            };
        }

        options.overrideSchemaOptions = {...options.overrideSchemaOptions,
            topLevelLinks: {
                self: options.url
            }
        };

        return this.serializer.serializeAsync(this.type, payload,options?.schema, options?.meta , options?.excludeData, {
            [this.type] : options?.overrideSchemaOptions
        });
    }

    public deserializeAsync(payload: any): T | T[] {
        return this.serializer.deserializeAsync(this.type, payload);
    }

    public serialize(payload: T | T[], options: SerializeOptions): any {
        const { api } = EnvironmentConfiguration.config;

        if (options?.paginationData) {
            const { total, page , size } = options.paginationData;
            const baseUrl = `/api/${api.version}`;
            const max = Math.ceil(total / size);
            delete options.paginationData;
            options.overrideSchemaOptions = {
                topLevelLinks : {
                    first: () => `${baseUrl}/${this.type}${this.replacePage(options.url, 1)}`,
                    last: () => `${baseUrl}/${this.type}${this.replacePage(options.url, max)}`,
                    next: () => `${baseUrl}/${this.type}${this.replacePage(options.url, page + 1 > max ? max : page + 1)}`,
                    prev: () => `${baseUrl}/${this.type}${this.replacePage(options.url, page - 1 < 1 ? page : page - 1)}`,
                    self: () => `${baseUrl}/${this.type}${options.url}`
                },
                topLevelMeta : {
                    max,
                    page,
                    size,
                    total
                }
            };
        }

        options.overrideSchemaOptions = {...options.overrideSchemaOptions,
            topLevelLinks: {
                self: () => options.url
            }
        };

        return this.serializer.serialize(this.type, payload,options?.schema, options?.meta , options?.excludeData, {
            [this.type] : options?.overrideSchemaOptions
        });
    }

    public deserialize(payload: any): T | T[] {
        return this.serializer.deserialize(this.type, payload);
    }

    public convertSerializerSchemaToObjectSchema(schema: Type<any>,rootSchema,schemaName: string): void {
        const serialize = Reflect.getMetadata("serialize",schema.prototype);
        const deserialize = Reflect.getMetadata("deserialize",schema.prototype);
        const relations = Reflect.getMetadata("relations",schema.prototype) ?? [];
        const schemaType = Reflect.getMetadata("type",schema.prototype);
        const { api } = EnvironmentConfiguration.config;

        const relationShips: { [key: string]: JSONAPISerializerRelation } = {};

        for (const {type,property} of relations) {
            const schemaTypeRelation = type();
            const relationType = Reflect.getMetadata("type",schemaTypeRelation.prototype);
            relationShips[property] = {
                type : relationType,
                links: {
                    related: (d) => `/api/${api.version}/${schemaType}/${d.id}/${property}`,
                    self: (d) => `/api/${api.version}/${schemaType}/${d.id}/relationships/${property}`
                }
            };
            if (schemaTypeRelation === rootSchema) {
                continue;
            }
            this.convertSerializerSchemaToObjectSchema(schemaTypeRelation,rootSchema,schemaName);
        }

        this.serializer.register(schemaType, schemaName , {
            whitelist: serialize,
            whitelistOnDeserialize: deserialize,
            relationships : relationShips,
            links : {
                self: (data,_a) => `/api/${api.version}/${schemaType}/${data.id}`
            }
        });
    }

    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage = (url: string, newPage: number): string =>
        url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);
}
