import "reflect-metadata";
import { Client } from "@elastic/elasticsearch";
import EnvironmentConfiguration from "./environment.config";

/**
 * Elastic search
 */
class ElasticSearchConfiguration {
    private static connection: Client;

    public static connect(): Client {
        if (!ElasticSearchConfiguration.connection) {
            return new Client({ node: EnvironmentConfiguration.config.elastic.url });
        }
        return ElasticSearchConfiguration.connection;
    }
}

export { ElasticSearchConfiguration };
