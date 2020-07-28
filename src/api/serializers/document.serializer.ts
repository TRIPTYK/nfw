import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";
import DocumentSchema from "./schemas/document.serializer.schema";
import {Document} from "../models/document.model";

@injectable()
export class DocumentSerializer extends BaseSerializer<Document> {
    public constructor(serializerParams: SerializerParams = {}) {
        super(DocumentSchema.schema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
