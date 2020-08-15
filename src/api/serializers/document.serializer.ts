import { BaseSerializer } from "../../core/serializers/base.serializer";
import { injectable } from "tsyringe";
import DocumentSchema from "./schemas/document.serializer.schema";
import {Document} from "../models/document.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.controller";
import DocumentSerializerSchema from "./schemas/document.serializer.schema2";

@injectable()
@JsonApiSerializer({
    schemas : [
        {
            name: "default",
            schema : DocumentSerializerSchema
        }
    ]
})
export class DocumentSerializer extends BaseSerializer<Document> {
    public constructor() {
        super(DocumentSchema.schema);
    }
}
