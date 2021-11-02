import { Factory } from '@mikro-orm/seeder';
import Faker from 'faker';
import { ArticleModel } from '../../api/models/article.model.js';

export class ArticleFactory extends Factory<ArticleModel> {
  model = ArticleModel;

  definition (faker: typeof Faker): Partial<ArticleModel> {
    return {
      title: faker.lorem.sentence(5),
    };
  }
}
