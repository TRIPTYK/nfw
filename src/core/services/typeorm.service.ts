import "reflect-metadata";
import {Connection, createConnection, ConnectionOptions} from "typeorm";
import BaseService from "./base.service";
import { singleton, autoInjectable } from "tsyringe";
import { LoggerService } from "../../api/services/logger.service";
import ConfigurationService from "./configuration.service";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
@singleton()
@autoInjectable()
export default class TypeORMService extends BaseService {
    private _connection: Connection;

    public constructor(
        public loggerService: LoggerService,
        private configurationService: ConfigurationService
    ) {
        super();
    }

    public async init() {
        this._connection = await createConnection(this.ConfigurationObject);
        this.loggerService.logger.info("Connection to mysql server established");
    }

    public async disconnect() {
        await this._connection.close();
        this.loggerService.logger.info("Disconnected from mysql server");
    }

    public get connection() {
        return this._connection;
    }

    public get ConfigurationObject(): ConnectionOptions {
        const {typeorm} = this.configurationService.config;

        return {
            database: typeorm.database,
            entities : typeorm.entities,
            synchronize : typeorm.synchronize,
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type as any,
            migrations : typeorm.migrations,
            username: typeorm.user,
            cli : {
                entitiesDir: typeorm.entitiesDir,
                migrationsDir: typeorm.migrationsDir
            }
        };
    }
}
