import {Document} from "../models/document.model";
import {EntityRepository} from "typeorm";
import {BaseRepository} from "nfw-core";


@EntityRepository(Document)
export class DocumentRepository extends BaseRepository<Document> {

    /** */
    constructor() {
        super();
    }
}
