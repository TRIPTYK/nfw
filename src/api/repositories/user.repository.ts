import { User } from "./../models/user.model";
import { Connection, Repository } from "typeorm";
import { connection as DBConnection } from "./../../config/environment.config";
import { omitBy, isNil } from "lodash";
import { Moment } from "moment-timezone";
import { IRepository } from "./../interfaces/IRepository.interface";

import * as Boom from "boom";

/**
 * 
 */
export class UserRepository implements IRepository {

  /** */
  connection : Connection;

  /**
   * 
   */
  repository : Repository<User>;

  /**
   * 
   */
  constructor() { this.init() }

  /**
   * 
   */
  async init() {
    this.connection = await DBConnection;
    this.repository = this.connection.getRepository(User);
  }

  /**
   * 
   */
  getRepository()  {
    return this.repository;
  }
  
  /**
   * Get user
   *
   * @param {Number} id - The id of user
   * 
   * @returns {Object|Error}
   */
  async get(id: number) {

    try {

      let user = await this.repository.findOne(id); 

      if (!user) 
      {
        throw Boom.notFound('User not found');
      }

      return user;
    } 
    catch (error) {
      throw Boom.badImplementation(error.message);
    }
  }

  /**
   * 
   */
  list({ page = 1, perPage = 30, username, email, role }) {

    const options = omitBy({ username, email, role }, isNil);

    return this.repository
      .createQueryBuilder("user")
      .where("user.username = :username OR user.email = :email OR user.role = :role", { username: options.username, email : options.email, role: options.role })
      .orderBy("user.createdAt", "DESC")
      .offset(perPage * (page - 1))
      .limit(perPage)
      .execute();
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
    if (!password) throw Boom.badRequest('A password is required to authorize a token generating');
    
    const user = await this.repository.findOne({ email });

    if (!user) 
    {
      throw Boom.notFound('User not found');
    }
    else if (await user.passwordMatches(password) === false) 
    {
      throw Boom.unauthorized('Password must match to authorize a token generating');
    }
    else if (refreshObject && refreshObject.userEmail === email && Moment(refreshObject.expires).isBefore()) 
    {
      throw Boom.unauthorized('Invalid refresh token.');
    }

    return { user, accessToken: user.token() };
  }
}
