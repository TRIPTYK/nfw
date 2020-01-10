import Boom from '@hapi/boom';
import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "@triptyk/nfw-core";
import { settingSerialize, settingDeserialize } from "../enums/json-api/setting.enum";

export class SettingSerializer extends BaseSerializer {
    /**
     * setting constructor
     */
    constructor(serializerParams = new SerializerParams()) {
        super('setting');
        const data = {
            whitelist: settingSerialize,
            whitelistOnDeserialize : settingDeserialize,
            relationships: {}
        }
        ;
        this.setupLinks(data, serializerParams);
        this.serializer.register(this.type, data);
    }
}
