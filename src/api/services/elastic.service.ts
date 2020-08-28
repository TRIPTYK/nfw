import "reflect-metadata";
import { Client } from "@elastic/elasticsearch";
import BaseService from "../../core/services/base.service";
import EnvironmentConfiguration from "../../config/environment.config";
import { singleton } from "tsyringe";

/**
 * Elastic search
 */
export default class ElasticSearchConnectionService extends BaseService {
    private _connection: Client;

    public async init() {
        this._connection = new Client({ node: EnvironmentConfiguration.config.elastic.url });
        await this._connection.ping();
    }

    public get connection() {
        return this._connection;
    }
}
