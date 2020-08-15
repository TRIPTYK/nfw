import { Serialize, Deserialize, SerializerSchema, Relation } from "../../../core/decorators/serializer.decorator";
import UserSerializerSchema from "./user.serializer.schema";

@SerializerSchema()
export default class DocumentSerializerSchema {
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
}
