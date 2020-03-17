import { JSONAPISerializerSchema } from "../base.serializer";
import DocumentSerializerSchema from "./document.serializer.schema";

export default class UserSerializerSchema {
    public static type: string = "user";

    /**
     * Allowed serialized elements
     */
    public static serialize: string[] = ["username", "email", "firstname", "lastname", "role", "createdAt", "updatedAt", "user"];

    /**
     * Allowed deserialize elements
     */
    public static deserialize: string[] = ["username", "email", "firstname", "password", "lastname", "role", "user"];

    public static get schema(): Readonly<JSONAPISerializerSchema> {
        return {
            relationships : {
                avatar : {
                    type: DocumentSerializerSchema.type,
                    whitelist : DocumentSerializerSchema.serialize
                },
            },
            type: UserSerializerSchema.type,
            whitelist: UserSerializerSchema.serialize,
            whitelistOnDeserialize : UserSerializerSchema.deserialize
        };
    }
}
