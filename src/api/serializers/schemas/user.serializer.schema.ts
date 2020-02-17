import { JSONAPISerializerSchema } from "../base.serializer";
import {documentSerialize} from "./document.serializer.schema";
import { documentType, userType } from "./types";

/**
 * Allowed serialized elements
 */
export const userSerialize: string[] = ["username", "email", "firstname", "lastname", "role", "createdAt", "updatedAt", "user"];

/**
 * Allowed deserialize elements
 */
export const userDeserialize: string[] = ["username", "email", "firstname", "password", "lastname", "role", "user"];

const UserSchema: Readonly<JSONAPISerializerSchema> = {
    relationships : {
        avatar : {
            type: documentType,
            whitelist : documentSerialize
        },
    },
    type: userType,
    whitelist: userSerialize,
    whitelistOnDeserialize : userDeserialize
};

export default UserSchema;
