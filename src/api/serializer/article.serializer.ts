import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import { ArticleModel } from '../models/article.model.js';
import { ConfigurationService } from '../services/configuration.service.js';

@injectable()
@singleton()
export class ArticleSerializer extends BaseJsonApiSerializer<ArticleModel> {
  constructor (@inject(ConfigurationService) configurationService: ConfigurationService) {
    super(configurationService);

    this.serializer.register('articles', {
      whitelist: ['title'],
    });
  }

  serialize (data: ArticleModel[] | ArticleModel, extraData?: Record<string, unknown>) {
    return this.serializer.serializeAsync('articles', data, extraData ?? {} as any);
  }
}
