/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Get } from "../../decorators/controller.decorator";
import { ApplicationRegistry } from "../../application/registry.application";
import TypeORMService from "../../services/typeorm.service";
import { autoInjectable } from "tsyringe";
import {Request,Response} from "express";
import { EntityMetadata, getRepository } from "typeorm";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("meta")
@autoInjectable()
export default class MetadataController extends BaseController {
    public constructor(private typeormConnection: TypeORMService) {
        super();
    }

    @Get("/types")
    public getSupportedTypes() {
        const connection = this.typeormConnection.connection;

        return connection.driver.supportedDataTypes;
    }

    @Get("/:entity/count")
    public async countEntityRecords(req: Request, res: Response) {
        const {entity} = req.params;
        const entityTarget = this.findEntityMetadataByName(entity);
        return {
            count : await getRepository(entityTarget.target).count()
        };
    }

    @Get("/:entity")
    public getEntityMeta(req: Request, res: Response) {
        return this.entityMetadaBuilder(this.findEntityMetadataByName(req.params.entity));
    }

    @Get("/")
    public getEntities(req: Request, res: Response) {
        return this.getJsonApiEntities()
            .map((table) => this.entityMetadaBuilder(table))
    }

    protected getJsonApiEntities() {
        return this.typeormConnection.connection.entityMetadatas
            .filter((table) => ApplicationRegistry.entities.includes(table.target as any));
    }

    protected findEntityMetadataByName(name: string) {
        const result = this.getJsonApiEntities()
            .filter((table) => table.name.toLowerCase() === name.toLowerCase());
        return result.length ? result[0] : null;
    }

    protected entityMetadaBuilder(table: EntityMetadata) {
        return {
            id: table.name,
            entityName : table.name,
            table: table.tableName,
            columns: table.ownColumns.filter((c) => !c.relationMetadata).map((column) => {
                return {
                    property : column.propertyName,
                    type: this.typeormConnection.connection.driver.normalizeType(column),
                    default: this.typeormConnection.connection.driver.normalizeDefault(column),
                    isPrimary: column.isPrimary,
                    isNullable : column.isNullable,
                    enumValues : column.enum
                }
            }),
            relations: table.ownRelations.map((rel) => {
                return {
                    propertyName : rel.propertyName,
                    inverseEntityName : rel.inverseEntityMetadata.name,
                    inversePropertyName : rel.inverseRelation.propertyName,
                    relationType : rel.relationType
                }
            })
        }
    }
}
