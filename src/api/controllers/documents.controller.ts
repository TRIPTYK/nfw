import { inject, injectable } from '@triptyk/nfw-core';
import { JsonApiQuery, ResourcesRegistry, JsonApiCreate, JsonApiDelete, JsonApiFindAll, JsonApiGet, JsonApiUpdate, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { InferType } from 'yup';
import { Controller, Param, UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { UserModel } from '../../database/models/user.model.js';
import { DocumentResourceService, DocumentResourceServiceImpl } from '../resources/documents/service.js';
import { DocumentResourceAuthorizerImpl } from '../resources/documents/authorizer.js';
import type { DocumentResource } from '../resources/documents/schema.js';
import { validatedDocumentSchema } from '../validators/document.validator.js';
import { canOrFail } from '../utils/can-or-fail.js';
import { JsonApiBody } from '../decorators/json-api-body.js';
import type { EntityData } from '@mikro-orm/core';
import type { DocumentModel } from '../../database/models/document.model.js';
import { ResourceAuthorizer } from '../resources/base/authorizer.js';
import { createFileUploadMiddleware } from '../middlewares/file-upload.middleware.js';

const RESOURCE_NAME = 'documents';

@injectable()
@Controller({
  routeName: `/${RESOURCE_NAME}`,
})
export class DocumentsController {
  public constructor (
    @inject(DocumentResourceServiceImpl) public documentService: DocumentResourceService,
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry,
    @inject(DocumentResourceAuthorizerImpl) public authorizer: ResourceAuthorizer<DocumentModel>,
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const document = await this.documentService.getOneOrFail(id, query);

    await canOrFail(this.authorizer, currentUser, 'read', document)

    return this.registry.getSerializerFor<DocumentResource>(RESOURCE_NAME).serializeOne(document);
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const [documents] = await this.documentService.getAll(query);

    await canOrFail(this.authorizer, currentUser, 'read', documents);

    return this.registry.getSerializerFor<DocumentResource>(RESOURCE_NAME).serializeMany(documents);
  }

  @JsonApiCreate()
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async create (@JsonApiBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @CurrentUser() currentUser: UserModel) {
    await canOrFail(this.authorizer, currentUser, 'create', body as never);

    const document = await this.documentService.create(body);

    return this.registry.getSerializerFor<DocumentResource>(RESOURCE_NAME).serializeOne(document);
  }

  @JsonApiUpdate()
  @UseMiddleware(createFileUploadMiddleware('./dist/uploads/'))
  async update (@Param('id') id: string, @JsonApiBody(RESOURCE_NAME, validatedDocumentSchema) body: InferType<typeof validatedDocumentSchema>, @CurrentUser() currentUser: UserModel) {
    await canOrFail<EntityData<DocumentModel>>(this.authorizer, currentUser, 'update', body as never);

    const document = await this.documentService.update(id, body);

    return this.registry.getSerializerFor<DocumentResource>(RESOURCE_NAME).serializeOne(document);
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    const document = await this.documentService.getOneOrFail(id, {});

    await canOrFail(this.authorizer, currentUser, 'delete', document);

    await this.documentService.delete(id);

    return null;
  }
}
