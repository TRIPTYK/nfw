import { RouterContext } from '@koa/router'
import { inject, injectable, InjectRepository, MiddlewareInterface } from '@triptyk/nfw-core'
import * as Jwt from 'jwt-simple';
import { UserModel } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ConfigurationService } from '../services/configuration.service.js';

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (@inject(ConfigurationService) private configurationService: ConfigurationService,
               @InjectRepository(UserModel) private userRepository: UserRepository) {}

  async use (context: RouterContext) {
    if (context.header.authorization) {
      const bearerToken = context.header.authorization.split(' ');
      if (bearerToken[0] === 'Bearer') {
        const { jwt } = await this.configurationService.getConfig();
        const decrypted = await Jwt.decode(bearerToken[1], jwt.secret).catch((err: any) => console.log(err));
        console.log('bananagwé', decrypted);
        const user = await this.userRepository.findOne({ id: decrypted.sub })
        context.state.user = user;
      }
    }
  }
}
