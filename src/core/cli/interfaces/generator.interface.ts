import { TemplateStructureInterface } from "../static/resources";

export interface GeneratorParameters {
    modelName: string;
    filePrefixName: string;
    fileTemplateInfo: TemplateStructureInterface;
    tableColumns: EntityColumns;
    classPrefixName: string;
}

export interface EntityColumn {
    name: string;
    type: string;
    length?: number;
    width?: number;
    precision?: number;
    scale?: number;
    isNullable: boolean;
    isPrimary?: boolean;
    isUnique?: boolean;
    default: any;
    date: Date;
    time: string;
    enums: Array<string>;
}

export type RelationTypes = "one-to-one" | "one-to-many" | "many-to-many";

export interface EntityRelation {
    name: string;
    target: string;
    type: RelationTypes;
    inverseRelationName?: string;
    isNullable?: boolean;
}

export interface EntityColumns {
    columns: EntityColumn[];
    relations: EntityRelation[];
}
