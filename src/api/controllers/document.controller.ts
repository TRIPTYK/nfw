import {
  injectable,
} from '@triptyk/nfw-core';
import { UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiController, JsonApiCreate, JsonApiDelete, JsonApiGet, JsonApiGetRelated, JsonApiGetRelationships, JsonApiList, JsonApiUpdate } from '@triptyk/nfw-jsonapi';
import { fileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentResource } from '../resources/document.resource.js';

@JsonApiController(DocumentResource)
@injectable()
export class DocumentController {
  @JsonApiList()
  public list () {}

  @JsonApiGet()
  public get () {}

  @JsonApiCreate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true,
  })
  @UseMiddleware(fileUploadMiddleware)
  public create () {}

  @UseMiddleware(fileUploadMiddleware)
  @JsonApiUpdate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true,
  })
  public update () {}

  @JsonApiDelete()
  public delete () {}

  @JsonApiGetRelated()
  public related () {}

  @JsonApiGetRelationships()
  public relationships () {}
}
