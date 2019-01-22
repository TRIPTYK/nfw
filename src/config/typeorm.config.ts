import "reflect-metadata";

import { createConnection, Connection } from "typeorm";
import { User } from "../api/models/user.model";
import { RefreshToken } from "../api/models/refresh-token.model";

class TypeORMConfiguration {
  private static connection : Connection;
  constructor () {}
  static async getConnection() 
  {
    if(this.connection)
    {
      return this.connection;
    }

    this.connection = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "e2q2mak7",
      database: "3rd_party_ts_boilerplate",
      entities: [ User, RefreshToken ],
      synchronize: true,
      logging: false
    });

    return this.connection;
  }
}

export { TypeORMConfiguration };