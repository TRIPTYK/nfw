import { Client } from "@elastic/elasticsearch";
import { BaseService, ConfigurationService } from "@triptyk/nfw-core";
import { autoInjectable, singleton } from "tsyringe";

/**
 * Elastic search
 */
@singleton()
@autoInjectable()
export class ElasticSearchConnectionService extends BaseService {
    private _connection: Client;

    public constructor(private configurationService: ConfigurationService) {
        super();
    }

    public async init() {
        this._connection = new Client({
            node: this.configurationService.config.elastic.url
        });
        await this._connection.ping();
    }

    public get connection() {
        return this._connection;
    }
}
