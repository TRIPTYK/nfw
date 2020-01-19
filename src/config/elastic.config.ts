import "reflect-metadata";
import { Client } from "@elastic/elasticsearch";
import EnvironmentConfiguration from "./environment.config";

/**
 * Elastic search
 */
class ElasticSearchConfiguration {

    public static async connect() {
        if (!ElasticSearchConfiguration.connection) {
            return new Client({ node: EnvironmentConfiguration.config.elastic.url });
        }
        return ElasticSearchConfiguration.connection;
    }

    private static connection: Client;
}

export { ElasticSearchConfiguration };
