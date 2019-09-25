import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {User} from "../api/models/user.model";
import {RefreshToken} from "../api/models/refresh-token.model";
import {Document} from "../api/models/document.model";

import {typeorm as TypeORM} from "nfw-core";


/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {
    private static connection: Connection;

    constructor() {
    }

    public static async connect() {
        const entities = [User, RefreshToken, Document];

        this.connection = await createConnection({
            type: "mysql",
            name: TypeORM.name,
            host: TypeORM.host,
            port: parseInt(TypeORM.port),
            username: TypeORM.user,
            password: TypeORM.pwd,
            database: TypeORM.database,
            entities
        });
        return await this.connection;
    }
}

export {TypeORMConfiguration};
