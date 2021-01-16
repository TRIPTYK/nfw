import {
    Serialize,
    Deserialize,
    SerializerSchema,
    Relation
} from "../../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./document.serializer.schema";
import { UserInterface } from "../../models/user.model";
import { Document } from "../../models/document.model";
import MasterSerializerSchema from "./master.serializer-schema";

@SerializerSchema()
export default class UserSerializerSchema
    extends MasterSerializerSchema<UserInterface>
    implements UserInterface {
    @Serialize()
    @Deserialize()
    public username;

    @Serialize()
    @Deserialize()
    public email;

    @Serialize()
    @Deserialize()
    public first_name;

    @Serialize()
    public updated_at;

    @Serialize()
    public created_at;

    @Serialize()
    @Deserialize()
    public role;

    @Serialize()
    @Deserialize()
    public last_name;

    @Deserialize()
    public password;

    @Relation(() => DocumentSerializerSchema)
    public documents;

    @Serialize()
    public deleted_at: any;

    @Relation(() => DocumentSerializerSchema)
    public avatar: Document;
}
