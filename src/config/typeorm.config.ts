import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import EnvironmentConfiguration from "./environment.config";
import { Environments } from "../api/enums/environments.enum";

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
            authSource: "admin",,
            database: typeorm.database,
            entities : [
                env === Environments.Production ?
                    __dirname + "/../api/models/*.js" :
                    __dirname + "/../api/models/*.ts"
            ],
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            username: typeorm.user
        });

        return TypeORMConfiguration.connection;
    }

    private static connection: Connection;
}

export {TypeORMConfiguration};
