"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonapi_serializer_1 = require("jsonapi-serializer");
const jsonapi_serializer_2 = require("jsonapi-serializer");
const Boom = require("boom");
class BaseSerializer {
    /**
     * @param type Entity type
     * @param params Serializer parameters
     */
    constructor(type, params) {
        /**
         *  Replace page number parameter value in given URL
         */
        this.replacePage = (url, newPage) => {
            return url.replace(/(.*page(?:\[|%5B)number(?:\]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);
        };
        /**
         * Serialize a payload to json-api format
         *
         * @param payload Payload
         */
        this.serialize = (payload) => {
            try {
                return this.serializer.serialize(payload);
            }
            catch (e) {
                throw Boom.expectationFailed(e.message);
            }
        };
        /**
         * Deserialize a payload from json-api format
         *
         * @param req
         */
        this.deserialize = async (req) => {
            try {
                return await this.deserializer.deserialize(req.body);
            }
            catch (e) {
                throw Boom.expectationFailed(e.message);
            }
        };
        this.type = type;
        this.options = params;
        this.options["convertCase"] = "kebab-case";
        this.options["unconvertCase"] = "camelCase";
        this.serializer = new jsonapi_serializer_1.Serializer(type, this.options);
        let deserializerOptions = Object.assign({}, this.options, {
            keyForAttribute: "underscore_case"
        });
        this.deserializer = new jsonapi_serializer_2.Deserializer(deserializerOptions); //merge objects
    }
}
BaseSerializer.withelist = [];
exports.BaseSerializer = BaseSerializer;
