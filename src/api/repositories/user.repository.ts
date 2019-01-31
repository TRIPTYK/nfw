import { User } from "./../models/user.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";
import { uuidv4 } from "uuid/v4";

import * as Moment from "moment-timezone";
import * as Boom from "boom";

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

  /** */
  constructor() { super(); }

  /**
   * Get one user
   *
   * @param {number} id - The id of user
   * 
   * @returns {User}
   */
  async one(id: number) {

    try {

      let user = await getRepository(User).findOne(id); 

      if (!user) 
      {
        throw Boom.notFound('User not found');
      }

      return user;
    } 
    catch (e) { throw Boom.expectationFailed(e.message); }
  }

  /**
   * Get a list of users according to current query parameters
   * 
   */
  list({ page = 1, perPage = 30, username, email, lastname, firstname, role }) {
    
    try {
      const repository = getRepository(User);
      const options = omitBy({ username, email, lastname, firstname, role }, isNil);
  
      return repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {Object} - Payload data
   * 
   * @returns {Object|Error}
   */
  async findAndGenerateToken(options) {

    const { email, password, refreshObject } = options;

    if (!email) throw Boom.badRequest('An email is required to generate a token');
    
    const user = await this.findOne({ email });

    if (!user) 
    {
      throw Boom.notFound('User not found');
    }
    else if (password && await user.passwordMatches(password) === false) 
    {
      throw Boom.unauthorized('Password must match to authorize a token generating');
    }
    else if (refreshObject && refreshObject.user.email === email && Moment(refreshObject.expires).isBefore()) 
    {
      throw Boom.unauthorized('Invalid refresh token.');
    }

    return { user, accessToken: user.token() };
  }

  /**
   * 
   * @param param
   */
  async oAuthLogin({ service, id, email, username, picture }) {

    try {

      const userRepository = getRepository(User);

      const user = await userRepository.findOne({
        where: { email : email },
      });

      if (user) {
        user.services[service] = id;
        if (!user.username) user.username = username;
        //if (!user.documents) user.documents = document; // TODO: manage picture
        return userRepository.save(user);
      }

      const password = uuidv4();

      // return userRepository.create({ services: { [service]: id }, email, password, username, picture }); // TODO: manage picture
      return userRepository.create({ services: { [service]: id }, email, password, username });
    }

    catch(e) { throw Boom.expectationFailed(e.message); }
  }
}
