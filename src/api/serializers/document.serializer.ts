import { BaseJsonApiSerializer } from "../../core/serializers/base.serializer";
import { singleton, autoInjectable } from "tsyringe";
import {Document} from "../models/document.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import DocumentSerializerSchema from "./schemas/document.serializer.schema";

@singleton()
@autoInjectable()
@JsonApiSerializer({
    schemas : () => [DocumentSerializerSchema],
    type : "documents"
})
export class DocumentSerializer extends BaseJsonApiSerializer<Document> {

}
