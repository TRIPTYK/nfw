import { Serialize, Deserialize, SerializerSchema, Relation } from "../../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./document.serializer.schema";

@SerializerSchema("users")
export default class UserSerializerSchema {
    @Serialize()
    @Deserialize()
    public username;

    @Serialize()
    @Deserialize()
    public email;

    @Relation(() => DocumentSerializerSchema)
    public documents;
}
