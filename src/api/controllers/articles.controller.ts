import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler, UseMiddleware, Param } from '@triptyk/nfw-core'
import { JsonApiQueryParams, ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { deserialize } from '../middlewares/deserialize.middleware.js';
import { UserDeserializer } from '../deserializer/user.deserializer.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import { ValidatedUser, ValidatedUserUpdate } from '../validators/user.validators.js';
import { ValidatedBody } from '../decorators/validated-body.decorator.js';
import { CurrentUser } from '../decorators/current-user.js';
import { ArticleModel } from '../models/article.model.js';
import { UserModel } from '../models/user.model.js';
import { ArticleSerializer } from '../serializer/article.serializer.js';

@Controller('/articles')
@injectable()
@UseMiddleware(CurrentUserMiddleware)
export class ArticlesController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(ArticleModel) private articleRepository: UserRepository) {}

  @GET('/')
  @UseResponseHandler(JsonApiResponsehandler, ArticleSerializer)
  public async list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams, @CurrentUser() currentUser?: UserModel) {
    return {
      payload: await this.articleRepository.jsonApiFind(queryParams, currentUser),
      queryParams,
    };
  }

  @GET('/:id')
  @UseResponseHandler(JsonApiResponsehandler, ArticleSerializer)
  async get (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams, @Param('id') id : string) {
    return {
      payload: await this.articleRepository.jsonApiFindOne({
        id,
      }, queryParams),
      queryParams,
    };
  }

  @POST('/')
  @UseMiddleware(deserialize(UserDeserializer))
  @UseResponseHandler(JsonApiResponsehandler, ArticleSerializer)
  create (@ValidatedBody(ValidatedUser) body: ValidatedUser) {
    return this.articleRepository.jsonApiCreate(body);
  }

  @PATCH('/:id')
  @UseMiddleware(deserialize(UserDeserializer))
  @UseResponseHandler(JsonApiResponsehandler, ArticleSerializer)
  update (@ValidatedBody(ValidatedUserUpdate) body: ValidatedUserUpdate, @Param('id') id: string) {
    return this.articleRepository.jsonApiUpdate(body, { id: id });
  }

  @DELETE('/:id')
  @UseResponseHandler(JsonApiResponsehandler, ArticleSerializer)
  delete (@Param('id') id: string) {
    return this.articleRepository.jsonApiRemove({ id: id });
  }
}
