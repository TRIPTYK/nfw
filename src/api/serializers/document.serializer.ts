import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";
import DocumentSchema from "./schemas/document.serializer.schema";

@injectable()
export class DocumentSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super(DocumentSchema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
