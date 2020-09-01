/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Get } from "../../decorators/controller.decorator";
import { ApplicationRegistry } from "../../application/registry.application";
import TypeORMService from "../../services/typeorm.service";
import { autoInjectable } from "tsyringe";
import {Request,Response} from "express";

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

    @Get("/:entity")
    public getEntityMeta(req: Request, res: Response) {
        const connection = this.typeormConnection.connection;

        const found  = connection.entityMetadatas.filter((table) => ApplicationRegistry.entities.includes(table.target as any))
            .filter((table) => table.name.toLowerCase() === req.params.entity.toLowerCase()).map((table) => {
                return {
                    entityName : table.name,
                    table: table.tableName,
                    columns: table.ownColumns.filter((c) => !c.relationMetadata).map((column) => {
                        return {
                            property : column.propertyName,
                            type: connection.driver.normalizeType(column),
                            default: connection.driver.normalizeDefault(column),
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
            });

        if (found.length) {
            return found[0];
        }else{
            return null;
        }
    }

    @Get("/")
    public getEntities(req: Request, res: Response) {
        const connection = this.typeormConnection.connection;

        return connection.entityMetadatas.filter((table) => ApplicationRegistry.entities.includes(table.target as any)).map((table) => {
            return {
                entityName : table.name,
                table: table.tableName,
                columns: table.ownColumns.filter((c) => !c.relationMetadata).map((column) => {
                    return {
                        property : column.propertyName,
                        type: connection.driver.normalizeType(column),
                        default: connection.driver.normalizeDefault(column),
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
        });
    }
}