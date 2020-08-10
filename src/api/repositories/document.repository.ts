import {Document} from "../models/document.model";
import {BaseRepository} from "../../core/repositories/base.repository";
import { JsonApiRepository } from "../../core/decorators/repository.decorator";


@JsonApiRepository(Document)
export class DocumentRepository extends BaseRepository<Document> {
}
