import { JSONAPISerializerSchema } from "../base.serializer";
import UserSerializerSchema from "./user.serializer.schema";

export default class DocumentSerializerSchema {
    public static type: string = "document";

    /**
     * Allowed serialized elements
     */
    public static serialize: string[] = ["fieldname", "filename", "path", "mimetype", "size", "createdAt"];

    /**
     * Allowed deserialize elements
     */
    public static deserialize: string[] = [];

    public static get schema(): Readonly<JSONAPISerializerSchema> {
        return {
            relationships : {
                user : {
                    type: UserSerializerSchema.type,
                    whitelist : UserSerializerSchema.serialize
                }
            },
            type: DocumentSerializerSchema.type,
            whitelist: DocumentSerializerSchema.serialize,
            whitelistOnDeserialize : DocumentSerializerSchema.deserialize
        };
    }
}
