import {EntityData} from '@mikro-orm/core';
import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseMiddleware, Body, Param } from '@triptyk/nfw-core';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import {DocumentModel} from '../models/document.model.js';
import {DocumentRepository} from '../repositories/document.repository.js';

@Controller('/documents')
@injectable()
export class DocumentController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(DocumentModel) private documentRepository: DocumentRepository) {

  }

  @GET('/:id')
  get (@Param('id') id: string) {
    return this.documentRepository.findOne({ id })
  }

  @POST('/')
  @UseMiddleware(FileUploadMiddleware)
  async create (@Body() body: unknown) {
    const doc = this.documentRepository.create(body as EntityData<DocumentModel>);
    await this.documentRepository.persistAndFlush(doc).catch(err => console.log(err));
    return doc;
  }

  @PATCH('/:id')
  async update (@Param('id') id: string, @Body() body: unknown) {
    await this.documentRepository.nativeUpdate({ id }, body as EntityData<DocumentModel>)
                                    .catch(err => console.log(err));
    return this.documentRepository.findOne({ id });
  }

  @DELETE('/:id')
  async delete (@Param('id') id: string) {
    await this.documentRepository.nativeDelete({ id });
    return {}
  }

  @GET('/')
  public async list () {
    return this.documentRepository.findAll();
  }
}
