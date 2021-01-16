/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as JSONAPISerializer from "json-api-serializer";
import SerializerInterface from "../interfaces/serializer.interface";
import {
    RelationMetadata,
    SchemaOptions
} from "../decorators/serializer.decorator";
import { Constructor } from "../types/global";
import ConfigurationService from "../services/configuration.service";
import { container } from "tsyringe";

import { toCamelCase, toKebabCase, toSnakeCase } from "../utils/case.util";
import * as pluralize from "pluralize";
import BaseSerializerSchema from "./base.serializer-schema";

export type SerializerParams = {
    pagination?: PaginationParams;
};

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

export type JSONAPISerializerCustom =
    | string
    | ((arg1?: any, arg2?: any) => any | string);

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

export abstract class BaseJsonApiSerializer<T>
    implements SerializerInterface<T> {
    public static whitelist: string[] = [];
    public type: string;
    public serializer: JSONAPISerializer;
    private configurationService: ConfigurationService;

    public constructor() {
        this.serializer = new JSONAPISerializer({
            convertCase: "camelCase",
            unconvertCase: "snake_case"
        } as JSONAPISerializerSchema);

        const schemasData: SchemaOptions = Reflect.getMetadata("schemas", this);

        for (const schema of schemasData.schemas()) {
            Reflect.defineMetadata("type", schemasData.type, schema);
        }
    }

    public init() {
        this.configurationService = container.resolve<ConfigurationService>(
            ConfigurationService
        );
        const schemasData: SchemaOptions = Reflect.getMetadata("schemas", this);
        this.type = schemasData.type;

        for (const schema of schemasData.schemas()) {
            const passedBy = [];
            this.convertSerializerSchemaToObjectSchema(
                schema,
                schema,
                Reflect.getMetadata("name", schema),
                passedBy
            );
        }
    }

    public paginate(
        payload: T | T[],
        schema,
        totalCount: number,
        currentPage: number,
        size: number
    ): any {}

    public serialize(payload: T | T[], schema: string): any {
        return this.serializer.serializeAsync(this.type, payload, schema);
    }

    public deserialize(payload: any): T | T[] {
        return this.serializer.deserializeAsync(this.type, payload);
    }

    private applyDeserializeCase(deserializeArray: string[]) {
        const convertCase = this.serializer.opts.convertCase ?? "camelCase";
        switch (convertCase) {
            case "camelCase":
                return deserializeArray.map((e) => toCamelCase(e));
            case "snake_case":
                return deserializeArray.map((e) => toSnakeCase(e));
            case "kebab-case":
                return deserializeArray.map((e) => toKebabCase(e));
            default: {
                return deserializeArray;
            }
        }
    }

    public getSchema(name: string) {
        const schemasData: SchemaOptions = Reflect.getMetadata("schemas", this);
        return schemasData
            .schemas()
            .find((schema) => Reflect.getMetadata("name", schema) === name);
    }

    public convertSerializerSchemaToObjectSchema(
        schema: Constructor<BaseSerializerSchema<T>>,
        rootSchema: Constructor<BaseSerializerSchema<T>>,
        schemaName: string,
        passedBy: string[]
    ): void {
        const serialize = (Reflect.getMetadata("serialize", schema.prototype) ??
            []) as string[];
        const deserialize = this.applyDeserializeCase(
            (Reflect.getMetadata("deserialize", schema.prototype) ??
                []) as string[]
        );
        const relations = (Reflect.getMetadata("relations", schema.prototype) ??
            []) as RelationMetadata[];
        const schemaType = Reflect.getMetadata("type", schema) as string;
        const schemaInstance = new schema();

        const relationShips: { [key: string]: JSONAPISerializerRelation } = {};

        if (passedBy.includes(schema.name)) {
            return;
        }

        passedBy.push(schema.name);

        for (const { type, property } of relations) {
            const schemaTypeRelation = type();
            const relationType = Reflect.getMetadata(
                "type",
                schemaTypeRelation
            );
            relationShips[property] = {
                deserialize: (data) => {
                    return { id: data.id };
                },
                type: relationType,
                links: (data, extraData) => {
                    return schemaInstance.relationshipLinks(
                        data,
                        extraData,
                        this.type,
                        property
                    );
                }
            };

            this.convertSerializerSchemaToObjectSchema(
                schemaTypeRelation,
                rootSchema,
                schemaName,
                passedBy
            );
        }

        this.serializer.register(schemaType, schemaName, {
            whitelist: serialize,
            whitelistOnDeserialize: deserialize,
            relationships: relationShips,
            links: (data, extraData) => {
                return schemaInstance.links(data, extraData, this.type);
            },
            meta: (data, extraData) => {
                return schemaInstance.meta(data, extraData, this.type);
            }
        });
    }

    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage = (url: string, newPage: number): string =>
        url.replace(
            /(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i,
            `$1${newPage}$3`
        );
}
