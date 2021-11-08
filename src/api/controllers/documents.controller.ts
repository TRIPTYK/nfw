import {
  Controller,
  DELETE,
  GET,
  injectable,
  InjectRepository,
  PATCH,
  POST,
  UseMiddleware,
  Param,
  UseResponseHandler,
  Uploaded,
  IUploaded,
} from '@triptyk/nfw-core';
import koaBody from 'koa-body';
import {
  JsonApiQueryParams,
  ValidatedJsonApiQueryParams,
} from '../../json-api/decorators/json-api-params.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { EntityFromBody } from '../decorators/entity-from-body.decorator.js';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentQueryParamsSchema } from '../query-params-schema/document.schema.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import { DocumentSerializer } from '../serializer/document.serializer.js';
import { ValidatedDocumentUpdate } from '../validators/document.validator.js';

@Controller('/documents')
@UseMiddleware(koaBody({
  formidable: {
    uploadDir: './dist/uploads',
    multiples: true,
    keepExtensions: true,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    onFileBegin: (name, file) => {
      const dir = './dist/uploads';
      let filename = file.name.split('.');
      file.originalName = file.name;
      filename = `${filename.slice(0, -1).join('.')}-${Date.now()}.${
        filename[filename.length - 1]
      }`;
      file.name = filename;
      file.path = `${dir}/${filename}`;
    },
  },
  multipart: true,
  urlencoded: true,
}))
@injectable()
export class DocumentController {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(DocumentModel)
    private documentRepository: DocumentRepository,
  ) {}

  @GET('/:id')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  get (
    @Param('id') id: string,
    @JsonApiQueryParams(DocumentQueryParamsSchema)
      queryParams: ValidatedJsonApiQueryParams,
  ) {
    return this.documentRepository.jsonApiFindOne({ id }, queryParams);
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
  async update (
    @Param('id') id: string,
    @EntityFromBody(ValidatedDocumentUpdate, DocumentModel) body: DocumentModel,
  ) {
    return this.documentRepository.jsonApiUpdate(body, { id });
  }

  @DELETE('/:id')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  async delete (@Param('id') id: string) {
  //
  }

  @GET('/')
  @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  public async list (
    @JsonApiQueryParams(DocumentQueryParamsSchema)
      queryParams: ValidatedJsonApiQueryParams,
  ) {
    return this.documentRepository.jsonApiFind(queryParams);
  }
}
