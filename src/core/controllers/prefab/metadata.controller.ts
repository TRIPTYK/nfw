/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Get } from "../../decorators/controller.decorator";
import { ApplicationRegistry } from "../../application/registry.application";
import { TypeORMConfiguration } from "../../../config/typeorm.config";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("meta")
export default class MetadataController extends BaseController {
    @Get("/types")
    public async getSupportedTypes() {
        const connection = await TypeORMConfiguration.connect();

        return connection.driver.supportedDataTypes;
    }

    @Get("/")
    public async getEntities() {
        const connection = await TypeORMConfiguration.connect();

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