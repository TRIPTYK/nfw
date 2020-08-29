import { TemplateStructureInterface } from "../static/resources";

export interface CrudOptions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

export interface GeneratorParameters {
    modelName: string;
    filePrefixName: string;
    fileTemplateInfo: TemplateStructureInterface;
    tableColumns: EntityColumns;
    classPrefixName: string;
    crudOptions: CrudOptions;
}

export interface Column {
    name: string;
    type: string;
    length: number;
    isPrimary: boolean;
    isUnique: boolean;
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
