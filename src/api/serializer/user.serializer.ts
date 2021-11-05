import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import type { UserModel } from '../models/user.model.js';
import { ConfigurationService } from '../services/configuration.service.js';

@injectable()
@singleton()
export class UserSerializer extends BaseJsonApiSerializer<UserModel> {
  constructor (@inject(ConfigurationService) configurationService: ConfigurationService) {
    super(configurationService);

    this.serializer.register('users', {
      whitelist: ['firstName', 'lastName'],
      relationships: {
        articles: {
          type: 'articles',
        },
        refreshToken: {
          type: 'refresh-tokens',
        },
      },
    });
    this.serializer.register('articles', {
      whitelist: ['title'],
    });
    this.serializer.register('refresh-tokens', {
      whitelist: ['token'],
    });
  }

  serialize (data: UserModel[] | UserModel, extraData?: Record<string, unknown>) {
    return this.serializer.serializeAsync('users', data, extraData ?? {} as any);
  }
}
