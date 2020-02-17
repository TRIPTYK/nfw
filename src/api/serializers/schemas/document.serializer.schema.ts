import { JSONAPISerializerSchema } from "../base.serializer";
import UserSchema, { userSerialize } from "./user.serializer.schema";
import { userType, documentType } from "./types";
/**
 * Allowed serialized elements
 */
export const documentSerialize: string[] = ["fieldname", "filename", "path", "mimetype", "size", "createdAt"];

/**
 * Allowed deserialize elements
 */
export const documentDeserialize: string[] = [];

const DocumentSchema: Readonly<JSONAPISerializerSchema> = {
    relationships : {
        user : {
            type: userType,
            whitelist : userSerialize
        }
    },
    type: documentType,
    whitelist: documentSerialize,
    whitelistOnDeserialize : documentDeserialize
};

export default DocumentSchema;
