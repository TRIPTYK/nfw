import {
    BaseSerializerSchema,
    Deserialize,
    Relation,
    Serialize,
    SerializerSchema
} from "@triptyk/nfw-core";
import { Document } from "../../models/document.model";
import { UserInterface } from "../../models/user.model";
import { DocumentSerializerSchema } from "./document.serializer.schema";

@SerializerSchema()
export class UserSerializerSchema
    extends BaseSerializerSchema<UserInterface>
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
