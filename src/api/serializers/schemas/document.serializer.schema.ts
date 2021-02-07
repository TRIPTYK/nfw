import {
    Deserialize,
    Relation,
    Serialize,
    SerializerSchema
} from "../../../core/decorators/serializer.decorator";
import BaseSerializerSchema from "../../../core/serializers/base.serializer-schema";
import { DocumentInterface } from "../../models/document.model";
import UserSerializerSchema from "./user.serializer.schema";

@SerializerSchema()
export default class DocumentSerializerSchema
    extends BaseSerializerSchema<DocumentInterface>
    implements DocumentInterface {
    @Serialize()
    public deleted_at: Date;

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
