import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {User} from "../api/models/user.model";
import {RefreshToken} from "../api/models/refresh-token.model";
import {Document} from "../api/models/document.model";

import {typeorm as TypeORM} from "./environment.config";


/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {

    public static async connect() {
        const entities = [User, RefreshToken, Document];

        TypeORMConfiguration.connection = await createConnection({
            database: TypeORM.database,
            entities,
            host: TypeORM.host,
            name: TypeORM.name,
            password: TypeORM.pwd,
            port: parseInt(TypeORM.port, 10),
            type: "mysql",
            username: TypeORM.user
        });
        return TypeORMConfiguration.connection;
    }

    private static connection: Connection;
}

export {TypeORMConfiguration};
