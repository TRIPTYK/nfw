import {
    BaseSerializerSchema,
    Deserialize,
    Relation,
    Serialize,
    SerializerSchema
} from "@triptyk/nfw-core";
import { DocumentInterface } from "../../models/document.model";
import { UserSerializerSchema } from "./user.serializer.schema";

@SerializerSchema()
export class DocumentSerializerSchema
    extends BaseSerializerSchema<DocumentInterface>
    implements DocumentInterface {
    @Serialize()
    public deleted_at: Date;

    @Serialize()
    public updated_at;

    @Serialize()
    public created_at;

    @Serialize()
    @Deserialize()
    public fieldname;

    @Serialize()
    @Deserialize()
    public filename;

    @Serialize()
    @Deserialize()
    public originalname;

    @Serialize()
    @Deserialize()
    public size;

    @Serialize()
    @Deserialize()
    public mimetype;

    @Serialize()
    @Deserialize()
    public path;

    @Relation(() => UserSerializerSchema)
    public users;

    @Relation(() => UserSerializerSchema)
    public user_avatar;
}
