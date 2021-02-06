import * as JSONAPISerializer from "json-api-serializer";
import {
    RelationMetadata,
    SchemaOptions
} from "../decorators/serializer.decorator";
import SerializerInterface from "../interfaces/serializer.interface";
import { Constructor } from "../types/global";
import { toCamelCase, toKebabCase, toSnakeCase } from "../utils/case.util";
import BaseSerializerSchema from "./base.serializer-schema";

export type SerializerParams = {
    pagination?: PaginationParams;
};

export type PaginationParams = {
    total: number;
    page: number;
    size: number;
    url: string;
};

export abstract class BaseJsonApiSerializer<T>
    implements SerializerInterface<T> {
    public static whitelist: string[] = [];
    public type: string;
    public serializer: JSONAPISerializer;

    public constructor() {
        this.serializer = new JSONAPISerializer({
            convertCase: "camelCase",
            unconvertCase: "snake_case"
        });

        const schemasData: SchemaOptions = Reflect.getMetadata("schemas", this);

        for (const schema of schemasData.schemas()) {
            Reflect.defineMetadata("type", schemasData.type, schema);
        }
    }

    public init() {
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

        // TODO : move in it's own prefab schema ? move outside ?
        this.serializer.register(this.type, "relationships", {
            topLevelLinks: (data, extraData) => {
                return {
                    self: `/${extraData.thisType}/${extraData.id}/relationships/${extraData.relationName}`,
                    related: `/${extraData.thisType}/${extraData.id}/${extraData.relationName}`
                };
            }
        });
    }

    public serialize(payload: T | T[], schema: string, extraData?: any): any {
        return this.serializer.serializeAsync(
            this.type,
            payload,
            schema,
            extraData
        );
    }

    public pagination(
        payload: T | T[],
        schema: string,
        extraData?: PaginationParams
    ): any {
        return this.serializer.serializeAsync(
            this.type,
            payload,
            schema,
            extraData
        );
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

        const relationShips: { [key: string]: any } = {};

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
            topLevelLinks: (data, extraData) => {
                return schemaInstance.topLevelLinks(data, extraData, this.type);
            },
            links: (data, extraData) => {
                return schemaInstance.links(data, extraData, this.type);
            },
            meta: (data, extraData) => {
                return schemaInstance.meta(data, extraData, this.type);
            }
        });
    }
}
