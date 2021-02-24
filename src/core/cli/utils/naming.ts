import { getConnection } from "typeorm";
import { ApplicationRegistry } from "../../application";

export function getJsonApiEntityName(prefix: string) {
    return getConnection()
        .entityMetadatas.filter((table) =>
            ApplicationRegistry.entities.includes(table.target as any)
        )
        .map((table) => {
            return {
                entityName: table.name,
                tableName: table.tableName
            };
        })
        .find((table) => table.tableName.toLowerCase() === prefix);
}
