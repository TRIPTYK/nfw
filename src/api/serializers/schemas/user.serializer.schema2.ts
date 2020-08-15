import { Serialize, Deserialize } from "../../../core/decorators/serializer.controller";

export default class UserSerializerSchema {
    @Serialize()
    @Deserialize()
    public username;
}
