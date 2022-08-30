
import { UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiController, JsonApiCreate, JsonApiDelete, JsonApiGet, JsonApiGetRelated, JsonApiGetRelationships, JsonApiList, JsonApiUpdate } from '@triptyk/nfw-jsonapi';
import { fileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { DocumentResource } from '../resources/document.resource.js';
import { ValidatedDocument } from '../validators/document.validator.js';

@JsonApiController(DocumentResource, {
  currentUser ({ koaContext }) {
    return koaContext.state.user;
  }
})
export class DocumentController {
  @JsonApiList()
  public list () {}

  @JsonApiGet()
  public get () {}

  @UseMiddleware(fileUploadMiddleware)
  @JsonApiCreate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true,
    validation: ValidatedDocument
  })
  public create () {}

  @UseMiddleware(fileUploadMiddleware)
  @JsonApiUpdate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true,
    validation: ValidatedDocument
  })
  public update () {}

  @JsonApiDelete()
  public delete () {}

  @JsonApiGetRelated()
  public related () {}

  @JsonApiGetRelationships()
  public relationships () {}
}
