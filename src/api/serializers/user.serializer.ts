import {BaseSerializer} from "./base.serializer";

import {SerializerParams} from "./serializerParams";
import {DocumentSerializer} from "./document.serializer";


export class UserSerializer extends BaseSerializer {
    public static whitelist: Array<string> = ['username', 'email', 'services', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt'];

    constructor(serializerParams: SerializerParams = new SerializerParams()) {
        super('user');

        const data = {
            links : (data) => {

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
