import { Factory } from '@mikro-orm/seeder';
import { RefreshTokenModel } from '../../auth/models/refresh-token.model.js';

export class RefreshTokenFactory extends Factory<RefreshTokenModel> {
  model = RefreshTokenModel;

  definition (): Partial<RefreshTokenModel> {
    return {
      expires: new Date(Date.now() + 500000)
    };
  }
}
