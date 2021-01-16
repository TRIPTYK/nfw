import { autoInjectable, injectable } from "tsyringe";
import BaseSerializerSchema from "../../../core/serializers/base.serializer-schema";
import ConfigurationService from "../../../core/services/configuration.service";

@autoInjectable()
export default class MasterSerializerSchema<T> extends BaseSerializerSchema<T> {
    meta(data: T, extraData: any, type: string) {
        //nothing
    }

    relationshipMeta(
        data: T,
        extraData: any,
        type: string,
        relationshipName: any
    ) {
        // nothing
    }

    public constructor(public configurationService: ConfigurationService) {
        super();
    }

    get baseUrl() {
        return "/api/v1";
    }
}
