import { createConnection, Connection } from "typeorm";
import { User } from "../api/models/user.model";
import { RefreshToken } from "../api/models/refresh-token.model";

/**
 * Export connection to MySQL
 */
const connection = async () => {
  let connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "e2q2mak7",
    database: "3rd-party-ts-boilerplate",
    entities: [ User, RefreshToken ]
  });
  return connection;
};

export { connection };