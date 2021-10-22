import { BaseJsonApiRepository, JsonApiRepository } from "@triptyk/nfw-core";
import { Document } from "../models/document.model";

@JsonApiRepository(Document)
export class DocumentRepository extends BaseJsonApiRepository<Document> {}
