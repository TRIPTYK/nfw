import {BaseSerializer} from "./base.serializer";

import {SerializerParams} from "./serializerParams";
import {DocumentSerializer} from "./document.serializer";
import {api, url} from "../../config/environment.config";


export class UserSerializer extends BaseSerializer {
    public static whitelist: Array<string> = ['username', 'email', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt'];

    constructor(serializerParams: SerializerParams = new SerializerParams()) {
        super('user');

        const data = {
            links : {
                self: (data) => {
                    return `${url}/api/${api}/${this.type}s/${data.id}`;
                }
            },
            whitelist: UserSerializer.whitelist,
            relationships: {
                avatar: {
                    type: "document"
                },
                documents: {
                    type: "document"
                }
            },
        };

        this.setupPagination(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("document", {
            whitelist: DocumentSerializer.whitelist
        });
    }
}
