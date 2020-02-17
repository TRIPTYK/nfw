import { JSONAPISerializerSchema } from "../base.serializer";
import UserSchema from "./user.serializer.schema";
import { userType, documentType } from "./types";
/**
 * Allowed serialized elements
 */
export const documentSerialize: string[] = ["fieldname", "filename", "path", "mimetype", "size", "createdAt"];

/**
 * Allowed deserialize elements
 */
export const documentDeserialize: string[] = [];

const DocumentSchema: JSONAPISerializerSchema = {
    relationships : {
        user : {
            type: userType,
            whitelist : UserSchema.whitelist
        }
    },
    type: documentType,
    whitelist: documentSerialize,
    whitelistOnDeserialize : documentDeserialize
};

export default DocumentSchema;
