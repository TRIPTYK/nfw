import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import { DocumentModel } from '../models/document.model.js';

export class ArticleRepository extends JsonApiRepository<DocumentModel> {
}
