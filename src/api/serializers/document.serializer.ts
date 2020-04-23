import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";
import DocumentSchema from "./schemas/document.serializer.schema";

@injectable()
export class DocumentSerializer extends BaseSerializer {
    public constructor(serializerParams: SerializerParams = {}) {
        super(DocumentSchema.schema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
