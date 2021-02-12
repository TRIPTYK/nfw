import { BaseJsonApiSerializer, JsonApiSerializer } from "@triptyk/nfw-core";
import { Document } from "../models/document.model";
import DocumentSerializerSchema from "./schemas/document.serializer.schema";

@JsonApiSerializer({
    schemas: () => [DocumentSerializerSchema],
    type: "documents"
})
export class DocumentSerializer extends BaseJsonApiSerializer<Document> {}
