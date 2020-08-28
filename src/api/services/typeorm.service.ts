import "reflect-metadata";
import {Connection, createConnection, ConnectionOptions} from "typeorm";
import EnvironmentConfiguration from "../../config/environment.config";
import BaseService from "../../core/services/base.service";
import { singleton } from "tsyringe";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
@singleton()
export default class TypeORMService extends BaseService {
    private _connection: Connection;

    public async init() {
        this._connection = await createConnection(this.ConfigurationObject);
    }

    public get connection() {
        return this._connection;
    }

    public get ConfigurationObject(): ConnectionOptions {
        const {config : {typeorm}} = EnvironmentConfiguration;

        return  {
            database: typeorm.database,
            entities : typeorm.entities,
            synchronize : typeorm.synchronize,
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type,
            migrations : typeorm.migrations,
            username: typeorm.user,
            cli : {
                entitiesDir: typeorm.entitiesDir,
                migrationsDir: typeorm.migrationsDir,
            }
        };
    }
}
