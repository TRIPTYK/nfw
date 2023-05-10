import { inject, injectable } from '@triptyk/nfw-core';
import { JsonApiQuery, JsonApiDelete, JsonApiFindAll, JsonApiGet, ResourceSerializer } from '@triptyk/nfw-resources';
import { InferType } from 'yup';
import { Controller, Param, POST, PUT, UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { UserModel } from '../../database/models/user.model.js';
import { DocumentResourceService, DocumentResourceServiceImpl } from '../resources/documents/service.js';
import { DocumentResourceAuthorizerImpl } from '../resources/documents/authorizer.js';
import { validatedDocumentSchema } from '../validators/document.validator.js';
import type { DocumentModel } from '../../database/models/document.model.js';
import { ResourceAuthorizer } from '../resources/base/authorizer.js';
import { createFileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { ValidatedFileBody } from '../decorators/validated-file-body.js';
import { jsonApiCreateFunction, jsonApiDeleteFunction, jsonApiFindAllFunction, jsonApiGetFunction, jsonApiUpdateFunction } from '../resources/base/controller.js';
import { DocumentSerializer } from '../resources/documents/serializer.js';
import type { DocumentResource } from '../resources/documents/schema.js';

const RESOURCE_NAME = 'documents';

@injectable()
@Controller({
  routeName: `/${RESOURCE_NAME}`,
})
export class DocumentsController {
  public constructor (
    @inject(DocumentResourceServiceImpl) public service: DocumentResourceService,
    @inject(DocumentSerializer) public serializer: ResourceSerializer<DocumentResource>,
    @inject(DocumentResourceAuthorizerImpl) public authorizer: ResourceAuthorizer<DocumentModel>,
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiGetFunction.call(this, id, query, currentUser);
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiFindAllFunction.call(this, query, currentUser);
  }

  @POST('/')
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async create (@ValidatedFileBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @CurrentUser() currentUser: UserModel) {
    return jsonApiCreateFunction.call(this, currentUser, body);
  }

  @PUT('/:id')
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async update (@Param('id') id: string, @ValidatedFileBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @CurrentUser() currentUser: UserModel) {
    return jsonApiUpdateFunction.call(this, currentUser, body, id);
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    return jsonApiDeleteFunction.call(this, id, currentUser);
  }
}
