import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {User} from "../api/models/user.model";
import {RefreshToken} from "../api/models/refresh-token.model";
import {Document} from "../api/models/document.model";
import { container } from "tsyringe";
import EnvironmentConfiguration from "./environment.config";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {

    public static async connect() {
        /** Singleton pattern */
        if (TypeORMConfiguration.connection) {
            return TypeORMConfiguration.connection;
        }

        const {config : {env, typeorm}} = EnvironmentConfiguration;

        TypeORMConfiguration.connection = await createConnection({
            database: typeorm.database,
            entities : [
                env === "production" ? __dirname + "/../api/models/*.js" : __dirname + "/../api/models/*.ts"
            ],
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type as any,
            username: typeorm.user
        });

        return TypeORMConfiguration.connection;
    }

    private static connection: Connection;
}

export {TypeORMConfiguration};
