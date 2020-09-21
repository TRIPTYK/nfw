import { TemplateStructureInterface } from "../static/resources";

export interface GeneratorParameters {
    modelName: string;
    filePrefixName: string;
    fileTemplateInfo: TemplateStructureInterface;
    tableColumns: EntityColumns;
    classPrefixName: string;
}

export interface Column {
    name: string;
    type: string;
    length?: number;
    width?: number;
    isNullable: boolean;
    isPrimary?: boolean;
    isUnique?: boolean;
    default: any;
}

export type RelationTypes = "one-to-one" | "one-to-many" | "many-to-many";

export interface Relation {
    name: string;
    target: string;
    type: RelationTypes;
    inverseRelationName?: string;
    isNullable?: boolean;
}

export interface EntityColumns {
    columns: Column[];
    relations: Relation[];
}
