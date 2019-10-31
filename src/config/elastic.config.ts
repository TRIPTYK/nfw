import "reflect-metadata";
import { Client } from "@elastic/elasticsearch";
import { elastic_url } from "./environment.config";
/**
 * Elastic search
 */
class ElasticSearchConfiguration {

    public static async connect() {
        if (!ElasticSearchConfiguration.connection) {
            return new Client({ node: elastic_url });
        }
        return ElasticSearchConfiguration.connection;
    }

    private static connection: Client;
}

export { ElasticSearchConfiguration };
