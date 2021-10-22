import {
    BaseSerializerSchema,
    Deserialize,
    Relation,
    Serialize,
    SerializerSchema
} from "@triptyk/nfw-core";

@SerializerSchema()
export class UserSerializerSchema
    extends BaseSerializerSchema<unknown> {
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

    @Serialize()
    public deleted_at: any;
}
