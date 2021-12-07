import {
  Controller,
  injectable,
} from '@triptyk/nfw-core';

@Controller('/documents')
@injectable()
export class DocumentController {
  // // eslint-disable-next-line no-useless-constructor
  // constructor (
  //   @InjectRepository(DocumentModel)
  //   private documentRepository: DocumentRepository,
  // ) {}

  // @GET('/:id')
  // @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  // async get (
  //   @Param('id') id: string,
  //   @JsonApiQueryParams(DocumentQueryParamsSchema)
  //     queryParams: ValidatedJsonApiQueryParams,
  // ) {
  //   return this.documentRepository.jsonApiFindOne(
  //     {
  //       id,
  //     },
  //     queryParams,
  //   )
  // }

  // @POST('/')
  // @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  // async create (@Uploaded('file') file: IUploaded) {
  //   const data = {
  //     filename: file.name,
  //     mimetype: file.type,
  //     path: file.path,
  //     size: file.size,
  //     originalName: file.originalName,
  //   };
  //   return this.documentRepository.jsonApiCreate(data as DocumentModel);
  // }

  // @PATCH('/:id')
  // @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  // async update (
  //   @Param('id') id: string,
  //   @Uploaded('file') file: IUploaded,
  // ) {
  //   this.documentRepository.findOne({ id }).then(file => file?.removeFromDisk());
  //   const data = {
  //     filename: file.name,
  //     mimetype: file.type,
  //     path: file.path,
  //     size: file.size,
  //     originalName: file.originalName,
  //   };
  //   return this.documentRepository.jsonApiUpdate(data as DocumentModel, { id });
  // }

  // @DELETE('/:id')
  // @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  // async delete (@Param('id') id: string) {
  //   return this.documentRepository.jsonApiRemove({ id });
  // }

  // @GET('/')
  // @UseResponseHandler(JsonApiResponsehandler, DocumentSerializer)
  // public async list (
  //   @JsonApiQueryParams(DocumentQueryParamsSchema)
  //     queryParams: ValidatedJsonApiQueryParams,
  // ) {
  //   return this.documentRepository.jsonApiFind(queryParams);
  // }
}
