import { UserModel } from '../models/user.model.js';
import { JsonApiRepository } from './json-api.repository.js';

export class UserRepository extends JsonApiRepository<UserModel> {
}
