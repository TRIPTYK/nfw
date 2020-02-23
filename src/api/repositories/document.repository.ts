import {Document} from "../models/document.model";
import {EntityRepository} from "typeorm";
import {BaseRepository} from "../../core/repositories/base.repository";


@EntityRepository(Document)
export class DocumentRepository extends BaseRepository<Document> {
}
