import { Connection, Repository } from "typeorm";

/**
 * 
 */
interface IRepository {

  /** */
  connection : Connection;

  /**
   * 
   */
  repository : Repository<any>;

  /**
   * async method called by constructor to properties setting
   * 
   * connection as connection from environment.config
   * repository as local repository type
   * 
   */
  init: Function

  /**
   * 
   */
  getRepository: Function;

}

export { IRepository };