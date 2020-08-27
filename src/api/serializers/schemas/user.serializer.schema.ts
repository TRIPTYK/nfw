import { Serialize, Deserialize, SerializerSchema, Relation } from "../../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./document.serializer.schema";
import { UserInterface } from "../../models/user.model";
import { Document } from "../../models/document.model";

@SerializerSchema()
export default class UserSerializerSchema implements UserInterface {
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

    @Serialize()
    public deleted_at: any;

    @Relation(() => DocumentSerializerSchema)
    public avatar: Document;
}
