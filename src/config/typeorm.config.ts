import { Kicker } from "../api/models/kicker.model";
import { Jiji } from "../api/models/jiji.model";
import { Sandwich } from "../api/models/sandwich.model";
import { Water } from "../api/models/water.model";

import { Banana } from "../api/models/banana.model";
import { Plz } from "../api/models/plz.model";
import { Banane } from "../api/models/banane.model";
import { Abort } from "../api/models/abort.model";
import { Chocolat } from "../api/models/chocolat.model";
import { Colde_one } from "../api/models/colde_one.model";
import { Date } from "../api/models/date.model";
import { Moartest } from "../api/models/moartest.model";
import { Potato } from "../api/models/potato.model";
import { Test } from "../api/models/test.model";

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
      entities: [User,RefreshToken,Document,Banana,Plz,Banane,Abort,Chocolat,Colde_one,Date,Moartest,Potato,Test,Kicker,Jiji,Sandwich,Water],
      migrationsTableName: "custom_migration_table",
      migrations: ["../migration/*.js"],
      cli: {
        migrationsDir: "migration"
      }
    });
    return await this.connection;
  }
}

export { TypeORMConfiguration };
