import {BaseSerializer} from "./base.serializer";
import {SerializerParams} from "./serializerParams";
import {UserSerializer} from "./user.serializer";

export class DocumentSerializer extends BaseSerializer {
    public static whitelist: Array<string> = ['fieldname', 'filename', 'path', 'mimetype', 'size', 'createdAt'];

    constructor(serializerParams = new SerializerParams()) {
        super('document');

        const data = {
            whitelist: DocumentSerializer.whitelist,
            relationships: {
                user: {
                    type: "user"
                }
            }
        };

        this.setupPagination(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("user", {
            whitelist: UserSerializer.whitelist
        });
    };

}
