import { BaseSerializer } from "./base.serializer";
import { injectable } from "tsyringe";
import DocumentSchema from "./schemas/document.serializer.schema";
import {Document} from "../models/document.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";

@injectable()
@JsonApiSerializer(Document)
export class DocumentSerializer extends BaseSerializer<Document> {
    public constructor() {
        super(DocumentSchema.schema);
    }
}
