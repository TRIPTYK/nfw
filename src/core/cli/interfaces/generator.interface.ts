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
    length: number;
    nullable: boolean;
    isPrimary: boolean;
    isUnique: boolean;
    default: any;
}

export interface Relation {
    name: string;
    type: string;
    length: number;
    isPrimary: boolean;
    isUnique: boolean;
}

export interface EntityColumns {
    columns: Column[];
    relations: Relation[];
}
