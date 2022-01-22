import {
  Controller,
  DELETE,
  GET,
  injectable,
  InjectRepository,
  Param,
  POST,
  PUT,
  UseMiddleware,
  UseResponseHandler,
} from '@triptyk/nfw-core';
import formidable from 'formidable';
import { JsonApiQueryParams, ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { File } from '../decorators/file.decorator.js';
import { fileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentQueryParamsSchema } from '../query-params-schema/document.schema.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import { DocumentSerializer } from '../serializer/document.serializer.js';

@Controller('/documents')
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
    )
  }

  @POST('/')
  @UseMiddleware(fileUploadMiddleware)
  async create (@File('file') file: formidable.File) {
    const data = {
      filename: file.path.split('/').pop(),
      mimetype: file.type,
      path: file.path,
      size: file.size,
      originalName: file.name,
    };
    return this.documentRepository.jsonApiCreate(data as DocumentModel);
  }

  @PUT('/:id')
  @UseMiddleware(fileUploadMiddleware)
  async replace (
    @Param('id') id: string,
    @File('file') file: formidable.File,
  ) {
    await this.documentRepository.findOneOrFail({ id }).then(file => file?.removeFromDisk());
    const data = {
      filename: file.path.split('/').pop(),
      mimetype: file.type,
      path: file.path,
      size: file.size,
      originalName: file.name,
    };
    return this.documentRepository.jsonApiUpdate(data as DocumentModel, { id });
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
