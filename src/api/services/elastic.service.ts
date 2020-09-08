import { Client } from "@elastic/elasticsearch";
import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import ConfigurationService from "../../core/services/configuration.service";

/**
 * Elastic search
 */
@singleton()
@autoInjectable()
export default class ElasticSearchConnectionService extends BaseService {
    private _connection: Client;

    public constructor(private configurationService: ConfigurationService) {
        super();
    }

    public async init() {
        this._connection = new Client({ node: this.configurationService.config.elastic.url });
        await this._connection.ping();
    }

    public get connection() {
        return this._connection;
    }
}
