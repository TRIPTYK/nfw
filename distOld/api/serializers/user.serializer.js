"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_serializer_1 = require("./base.serializer");
const environment_config_1 = require("../../config/environment.config");
const serializerParams_1 = require("./serializerParams");
const document_model_1 = require("../models/document.model");
const typeorm_1 = require("typeorm");
const document_serializer_1 = require("./document.serializer");
class UserSerializer extends base_serializer_1.BaseSerializer {
    constructor(ss = new serializerParams_1.SerializerParams()) {
        const data = {
            attributes: UserSerializer.withelist,
            dataLinks: {
                self: (dataSet, data) => {
                    if (data.id)
                        return `${environment_config_1.url}/api/${environment_config_1.api}/${this.type}/${data.id}`;
                }
            },
            documents: {
                ref: 'id',
                attributes: document_serializer_1.DocumentSerializer.withelist,
                valueForRelationship: async function (relationship) {
                    return await typeorm_1.getRepository(document_model_1.Document).findOne(relationship.id);
                }
            }
        };
        if (ss.hasPaginationEnabled()) {
            const { total, request } = ss.getPaginationData();
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
        super(ss.getType() ? ss.getType() : 'users', data);
    }
    ;
}
UserSerializer.withelist = ['username', 'email', 'services', 'documents', 'recipes', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt', 'avatar'];
exports.UserSerializer = UserSerializer;
