/* eslint-disable @typescript-eslint/no-unused-vars */
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

    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage = (url: string, newPage: number): string =>
        decodeURIComponent(
            url.replace(
                /(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i,
                `$1${newPage}$3`
            )
        );

    public topLevelLinks(data, extraData, type) {
        if (extraData.page) {
            const max = Math.ceil(extraData.total / extraData.size);
            return {
                first: `${this.baseUrl}/${type}${this.replacePage(
                    extraData.url,
                    1
                )}`,
                last: `${this.baseUrl}/${type}${this.replacePage(
                    extraData.url,
                    max
                )}`,
                prev: `${this.baseUrl}/${type}${this.replacePage(
                    extraData.url,
                    extraData.page - 1 < 1 ? extraData.page : extraData.page - 1
                )}`,
                next: `${this.baseUrl}/${type}${this.replacePage(
                    extraData.url,
                    extraData.page - 1 < 1 ? extraData.page : extraData.page - 1
                )}`,
                self: `${this.baseUrl}/${type}${extraData.url}`
            };
        }

        return {
            self: `${this.baseUrl}/${type}${extraData.url}`
        };
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
