import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import type { DocumentModel } from '../models/document.model.js';

export class DocumentRepository extends JsonApiRepository<DocumentModel> {
}
