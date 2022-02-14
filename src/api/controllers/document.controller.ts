import type { EntityDTO } from '@mikro-orm/core';
import {
  Controller,
  DELETE,
  GET,
  injectable,
  InjectRepository,
  Param,
  POST,
  PUT,
  UseErrorHandler,
  UseGuard,
  UseMiddleware,
  UseResponseHandler,
} from '@triptyk/nfw-core';
import type { ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { JsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { JsonApiErrorHandler } from '../../json-api/error-handler/json-api.error-handler.js';
import { ContentGuard } from '../../json-api/guards/content.guard.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { ValidatedFile } from '../decorators/file.decorator.js';
import { fileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentQueryParamsSchema } from '../query-params-schema/document.schema.js';
import type { DocumentRepository } from '../repositories/document.repository.js';
import { DocumentSerializer } from '../serializer/document.serializer.js';
import { ValidatedDocument } from '../validators/document.validator.js';

@Controller('/documents')
@UseErrorHandler(JsonApiErrorHandler)
@UseGuard(ContentGuard, true)
@UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
@injectable()
export class DocumentController {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(DocumentModel)
    private documentRepository: DocumentRepository,
  ) {}

  @GET('/:id')
  async get (
    @Param('id') id: string,
    @JsonApiQueryParams(DocumentQueryParamsSchema)
      queryParams: ValidatedJsonApiQueryParams,
  ) {
    return this.documentRepository.jsonApiFindOne(
      {
        id,
      },
      queryParams,
    );
  }

  @POST('/')
  @UseMiddleware(fileUploadMiddleware)
  async create (@ValidatedFile('file', ValidatedDocument) file: ValidatedDocument) {
    return this.documentRepository.jsonApiCreate(file);
  }

  @PUT('/:id')
  @UseMiddleware(fileUploadMiddleware)
  async replace (
    @Param('id') id: string,
    @ValidatedFile('file', ValidatedDocument) document: Partial<EntityDTO<DocumentModel>>,
  ) {
    await this.documentRepository.findOneOrFail({ id }).then(file => file?.removeFromDisk());
    const up = await this.documentRepository.jsonApiUpdate(document, { id });
    return up;
  }

  @DELETE('/:id')
  async delete (@Param('id') id: string) {
    return this.documentRepository.jsonApiRemove({ id });
  }

  @GET('/')
  public async list (
    @JsonApiQueryParams(DocumentQueryParamsSchema)
      queryParams: ValidatedJsonApiQueryParams,
  ) {
    return this.documentRepository.jsonApiFind(queryParams);
  }
}
