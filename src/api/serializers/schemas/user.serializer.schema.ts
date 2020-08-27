import { Serialize, Deserialize, SerializerSchema, Relation } from "../../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./document.serializer.schema";

@SerializerSchema()
export default class UserSerializerSchema {
    @Serialize()
    @Deserialize()
    public username;

    @Serialize()
    @Deserialize()
    public email;

    @Serialize()
    @Deserialize()
    public firstname;

    @Serialize()
    public updated_at;

    @Serialize()
    public created_at;

    @Serialize()
    public role;

    @Serialize()
    @Deserialize()
    public lastname;

    @Deserialize()
    public password;

    @Relation(() => DocumentSerializerSchema)
    public documents;
}
