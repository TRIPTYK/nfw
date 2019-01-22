import { Connection, Repository } from "typeorm";

/**
 * 
 */
interface IRepository {

  /** 
   * TypeORM connection to MySQL server 
   * */
  connection : Connection;

  /**
   * Current repository
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
   * Repository getter
   */
  getRepository: Function;

}

export { IRepository };