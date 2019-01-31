import { getConnection, Connection } from "typeorm";
import { typeorm as TypeORM } from "./../../config/environment.config";

/**
 * Main controller contains properties/methods
 * TODO implements more methods in BaseController
 */
abstract class BaseController {

  /**
   * Store the TypeORM current connection to database
   * 
   * @property Connection
   * @protected
   */
  protected connection : Connection;

  /**
   * Super constructor
   * Retrieve database connection, and store it into connection
   */
  constructor() { this.connection = getConnection(TypeORM.name); }

};

export { BaseController };