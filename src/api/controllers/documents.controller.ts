import { EntityData } from '@mikro-orm/core';
import {
  Controller,
  DELETE,
  GET,
  injectable,
  InjectRepository,
  PATCH,
  POST,
  UseMiddleware,
  Body,
  Param,
  UseResponseHandler,
  Uploaded,
  IUploaded,
} from '@triptyk/nfw-core';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import { DocumentSerializer } from '../serializer/document.serializer.js';

@Controller('/documents')
@injectable()
export class DocumentController {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(DocumentModel)
    private documentRepository: DocumentRepository,
  ) {}

  @GET('/:id')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  get (@Param('id') id: string) {
    return this.documentRepository.findOne({ id });
  }

  @POST('/')
  @UseMiddleware(FileUploadMiddleware)
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  async create (@Uploaded('file') file: IUploaded) {
    const data = {
      filename: file.name,
      mimetype: file.type,
      path: file.path,
      size: file.size,
      originalName: file.originalName,
    };
    return this.documentRepository.jsonApiCreate(data as DocumentModel);
  }

  @PATCH('/:id')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  async update (@Param('id') id: string, @Body() body: unknown) {
    await this.documentRepository.nativeUpdate(
      { id },
      body as EntityData<DocumentModel>,
    );
    return this.documentRepository.findOne({ id });
  }

  @DELETE('/:id')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  async delete (@Param('id') id: string) {
    await this.documentRepository.nativeDelete({ id });
    return {};
  }

  @GET('/')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  public async list () {
    return this.documentRepository.findAll();
  }
}
