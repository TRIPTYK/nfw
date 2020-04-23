import "reflect-metadata";
import {Connection, createConnection, ConnectionOptions} from "typeorm";
import EnvironmentConfiguration from "./environment.config";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {
    private static connection: Connection;

    public static get ConfigurationObject(): ConnectionOptions {
        const {config : {typeorm}} = EnvironmentConfiguration;

        return  {
            authSource: "admin",
            database: typeorm.database,
            entities : typeorm.entities,
            synchronize : typeorm.synchronize,
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type,
            migrations : typeorm.migrations,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            username: typeorm.user,
            cli : {
                entitiesDir: typeorm.entitiesDir,
                migrationsDir: typeorm.migrationsDir,
            }
        };
    }

    public static async connect(): Promise<Connection> {
        /** Singleton pattern */
        if (TypeORMConfiguration.connection) {
            return TypeORMConfiguration.connection;
        }

        return TypeORMConfiguration.connection = await createConnection(TypeORMConfiguration.ConfigurationObject);
    }
}

export {TypeORMConfiguration};
