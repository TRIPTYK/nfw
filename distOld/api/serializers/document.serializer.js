"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_serializer_1 = require("./base.serializer");
const serializerParams_1 = require("./serializerParams");
const environment_config_1 = require("../../config/environment.config");
const typeorm_1 = require("typeorm");
const user_model_1 = require("../models/user.model");
const user_serializer_1 = require("./user.serializer");
class DocumentSerializer extends base_serializer_1.BaseSerializer {
    constructor(serializerParams = null) {
        if (!serializerParams)
            serializerParams = new serializerParams_1.SerializerParams();
        const data = {
            attributes: DocumentSerializer.withelist,
            dataLinks: {
                self: (dataSet, data) => {
                    if (data.id)
                        return `${environment_config_1.url}/api/${environment_config_1.api}/${this.type}/${data.id}`;
                }
            },
            user: {
                ref: 'id',
                attributes: user_serializer_1.UserSerializer.withelist,
                valueForRelationship: async function (relationship) {
                    return await typeorm_1.getRepository(user_model_1.User).findOne(relationship.id);
                }
            }
        };
        if (serializerParams.hasPaginationEnabled()) {
            const { total, request } = serializerParams.getPaginationData();
            const page = parseInt(request.query.page.number);
            const size = request.query.page.size;
            const baseUrl = `${environment_config_1.url}/api/${environment_config_1.api}`;
            const max = Math.ceil(total / size);
            data["topLevelLinks"] = {
                self: () => `${baseUrl}/${this.type}${request.url}`,
                next: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page + 1 > max ? max : page + 1)}`,
                prev: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page - 1 < 1 ? page : page - 1)}`,
                last: () => `${baseUrl}/${this.type}${this.replacePage(request.url, max)}`,
                first: () => `${baseUrl}/${this.type}${this.replacePage(request.url, 1)}`
            };
        }
        super(serializerParams.getType() ? serializerParams.getType() : 'documents', data);
    }
    ;
}
DocumentSerializer.withelist = ['fieldname', 'filename', 'path', 'mimetype', 'size', 'user', 'createdAt'];
exports.DocumentSerializer = DocumentSerializer;
