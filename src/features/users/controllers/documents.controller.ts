import { inject, injectable } from '@triptyk/nfw-core';
import { JsonApiDelete, JsonApiFindAll, JsonApiGet } from '@triptyk/nfw-resources';
import type { JsonApiQuery, ResourceSerializer } from '@triptyk/nfw-resources';
import { Controller, Param, POST, PUT, UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../../../decorators/json-api-query.js';
import { CurrentUser } from '../../../decorators/current-user.decorator.js';
import { UserModel } from '../models/user.model.js';
import { DocumentResourceServiceImpl } from '../resources/documents/service.js';
import type { DocumentResourceService } from '../resources/documents/service.js';
import { DocumentResourceAuthorizerImpl } from '../resources/documents/authorizer.js';
import { validatedDocumentSchema } from '../validators/document.validator.js';
import { serializeDocument } from '../models/document.model.js';
import type { DocumentModel } from '../models/document.model.js';
import { createFileUploadMiddleware } from '../../../middlewares/file-upload.middleware.js';
import { ValidatedFileBody } from '../../../decorators/validated-file-body.js';
import { DocumentSerializer } from '../resources/documents/serializer.js';
import type { InferType } from 'yup';
import type { ResourceAuthorizer } from '../../shared/resources/base/authorizer.js';
import { canOrFail } from '../../../utils/can-or-fail.js';

const RESOURCE_NAME = 'documents';

@injectable()
@Controller({
  routeName: `/${RESOURCE_NAME}`,
})
export class DocumentsController {
  public constructor (
    @inject(DocumentResourceServiceImpl) public service: DocumentResourceService,
    @inject(DocumentSerializer) public serializer: ResourceSerializer,
    @inject(DocumentResourceAuthorizerImpl) public authorizer: ResourceAuthorizer<DocumentModel>,
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const resourceModel = await this.service.getOneOrFail(id, query);
    await canOrFail(this.authorizer, currentUser, 'read', resourceModel);
    return this.serializer.serializeOne(serializeDocument(resourceModel), query, {
      endpointURL: `documents/${id}`
    });
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const [resourcesModel, count] = await this.service.getAll(query);
    await canOrFail(this.authorizer, currentUser, 'read', resourcesModel);
    return this.serializer.serializeMany(resourcesModel.map(serializeDocument), query, {
      pagination: query.page
        ? {
            total: count,
            size: query.page.size,
            number: query.page.number,
          }
        : undefined,
      endpointURL: 'documents'
    });
  }

  @POST('/')
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async create (@ValidatedFileBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    await canOrFail(this.authorizer, currentUser, 'create', body);
    const document = await this.service.create(body);
    return this.serializer.serializeOne(serializeDocument(document), {}, {
      endpointURL: `documents/${document.id}`
    });
  }

  @PUT('/:id')
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async update (@Param('id') id: string, @ValidatedFileBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    await canOrFail(this.authorizer, currentUser, 'update', body);
    const user = await this.service.update(id, body);
    return this.serializer.serializeOne(serializeDocument(user), query, {
      endpointURL: `documents/${user.id}`
    });
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    const document = await this.service.getOneOrFail(id, {});
    await canOrFail(this.authorizer, currentUser, 'delete', document);
    await this.service.delete(id);
    return null;
  }
}
