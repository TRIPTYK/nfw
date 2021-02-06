import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import { BaseJsonApiSerializer } from "../../core/serializers/base.serializer";
import { Document } from "../models/document.model";
import DocumentSerializerSchema from "./schemas/document.serializer.schema";

@JsonApiSerializer({
    schemas: () => [DocumentSerializerSchema],
    type: "documents"
})
export class DocumentSerializer extends BaseJsonApiSerializer<Document> {}
