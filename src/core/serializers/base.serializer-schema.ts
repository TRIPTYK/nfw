import { container } from "tsyringe";
import ConfigurationService from "../services/configuration.service";

export interface BaseSerializerSchemaInterface<T> {
    baseUrl: string;
    links(
        data: T,
        extraData: any,
        type: string
    ): {
        self?: string;
        related?: string;
    };
    relationshipLinks(
        data: T,
        extraData: any,
        type: string,
        relationshipName: string
    ): {
        self?: string;
        related?: string;
    };
    relationshipMeta(
        data: T,
        extraData: any,
        type: string,
        relationshipName: string
    ): any;
    meta(data: T, extraData: any, type: string): any;
}

export default abstract class BaseSerializerSchema<T>
    implements BaseSerializerSchemaInterface<T> {
    public get baseUrl() {
        const configurationService = container.resolve<ConfigurationService>(
            ConfigurationService
        );
        return `/api/${configurationService.config.api.version}`;
    }

    public links(data, extraData, type) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}`
        };
    }

    public relationshipLinks(data, extraData, type, relationshipName) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}/relationships/${relationshipName}`,
            related: `${this.baseUrl}/${type}/${data.id}/${relationshipName}`
        };
    }

    public meta(data: T, extraData: any, type: string) {
        //nothing to do
    }

    public relationshipMeta(
        data: T,
        extraData: any,
        type: string,
        relationshipName
    ) {
        // nothing to do
    }
}
