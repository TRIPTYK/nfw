import "reflect-metadata";

import { createConnection, Connection } from "typeorm";
import { typeorm as TypeORM } from "./environment.config";
import { User } from "../api/models/user.model";
import { RefreshToken } from "../api/models/refresh-token.model";
import { Document } from "../api/models/document.model";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {
  private static connection : Connection;
  constructor () { }
  public static async connect()
  {
    this.connection = await createConnection({
      type: "mysql",
      name: TypeORM.name,
      host: TypeORM.host,
      port: parseInt(TypeORM.port),
      username: TypeORM.user,
      password: TypeORM.pwd,
      database: TypeORM.database,
      entities: [ User, RefreshToken, Document ], // ^\s*entities.*$
      synchronize: true,
      logging: false
    });
    return await this.connection;
  }
}

export { TypeORMConfiguration };
