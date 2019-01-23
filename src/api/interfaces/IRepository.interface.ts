import { Connection, Repository } from "typeorm";

/**
 * Define required members for TypeORM CustomRepository
 */
interface IRepository {

  /** 
   * TypeORM connection to database server 
   */
  connection : Connection;

  /**
   * Current repository
   */
  repository : Repository<any>;

  /**
   * Getter
   */
  get: Function;

}

export { IRepository };