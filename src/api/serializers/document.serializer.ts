import { BaseSerializer } from "../../core/serializers/base.serializer";
import { injectable } from "tsyringe";
import {Document} from "../models/document.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./schemas/document.serializer.schema";

@injectable()
@JsonApiSerializer({
    schemas : [DocumentSerializerSchema],
    type : "documents"
})
export class DocumentSerializer extends BaseSerializer<Document> {

}
