"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const environment_config_1 = require("./environment.config");
const user_model_1 = require("../api/models/user.model");
const refresh_token_model_1 = require("../api/models/refresh-token.model");
const document_model_1 = require("../api/models/document.model");
/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
class TypeORMConfiguration {
    constructor() { }
    static async connect() {
        this.connection = await typeorm_1.createConnection({
            type: "mysql",
            name: environment_config_1.typeorm.name,
            host: environment_config_1.typeorm.host,
            port: parseInt(environment_config_1.typeorm.port),
            username: environment_config_1.typeorm.user,
            password: environment_config_1.typeorm.pwd,
            database: environment_config_1.typeorm.database,
            entities: [user_model_1.User, refresh_token_model_1.RefreshToken, document_model_1.Document]
        });
        return await this.connection;
    }
}
exports.TypeORMConfiguration = TypeORMConfiguration;
