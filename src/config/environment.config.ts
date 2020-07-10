/* eslint-disable @typescript-eslint/camelcase */
import * as fs from "fs";
import * as dotenv from "dotenv";
import { parseBool } from "../core/utils/string-parse.util";
import { Environments } from "../api/enums/environments.enum";
import * as yargs from "yargs";

// tslint:disable-next-line: interface-over-type-literal
type Configuration = {
    env?: Environments
    port?: number
    url?: string
    authorized?: string | string[]
    api?: {
        name: string
        version: string
    }
    caching_enabled?: boolean
    auth_mode?: AuthModes
    jwt?: {
        refresh_expires: number
        access_expires: number
        secret: string
    }
    elastic?: {
        enabled: boolean
        url: string
    }
    facebook?: {
        id: string
        redirect: string
        secret: string
    }
    outlook?: {
        id: string
        redirect: string
        secret: string
    }
    google?: {
        id: string
        redirect: string
        secret: string
    }
    typeorm?: {
        database: string
        host: string
        name: string
        synchronize: boolean
        entities: string[]
        port: number
        pwd: string
        type: SupportedDatabasesTypes
        user: string
        tableName: string
        migrationsDir: string
        entitiesDir: string
        migrations: string[]
        seeds: string
        factories: string
    }
    deploy?: {
        ip: string
        user: string
        path: string
        key: string
        repo: string
        ref: string
    }
    jimp?: {
        isActive: boolean
        md: number
        xl: number
        xs: number
    }
    mailgun?: {
        privateKey: string
        publicKey: string
        domain: string
        host: string
    }
    https?: {
        ca: string
        cert: string
        isActive: boolean
        key: string
    }
};

type SupportedDatabasesTypes = "mysql" | "oracle" | "mariadb" | "mongodb";
type AuthModes = "jwt" | "session";

export default class EnvironmentConfiguration {
    private static env: Configuration;

    public static get config(): Configuration {
        if (!EnvironmentConfiguration.env) {
            throw new Error("Environment not loaded");
        }
        return EnvironmentConfiguration.env;
    }

    public static guessCurrentEnvironment(): Environments {
        const {argv : { env }} = yargs.options({
            env: { type: "string" }
        });

        if (env && ["production", "test", "staging", "development"].includes(env)) { return env as Environments };

        return ["production", "test", "staging", "development"].includes(process.env.NODE_ENV) ?
            process.env.NODE_ENV as Environments : Environments.Development;
    }

    public static loadEnvironment(env: Environments = Environments.Development): Configuration {
        dotenv.config({path : `${process.cwd()}/${env}.env`});
        return EnvironmentConfiguration.env = EnvironmentConfiguration.getEnvironment(env);
    }

    public static getEnvironment(env: Environments = Environments.Development): Configuration {
        const loaded = dotenv.parse(fs.readFileSync(`${process.cwd()}/${env}.env`));
        return EnvironmentConfiguration.buildEnvObject(loaded);
    }

    private static buildEnvObject(envObj: dotenv.DotenvParseOutput): Configuration {
        const applyObj: Configuration = {};

        applyObj.env = (["production", "test", "staging", "development"].includes(envObj.NODE_ENV) ? envObj.NODE_ENV : "development") as Environments;
        applyObj.port = parseInt(envObj.PORT, 10);
        applyObj.url = envObj.URL;
        applyObj.authorized = envObj.AUTHORIZED.split(",");
        applyObj.api = {
            version : envObj.API_VERSION,
            name : envObj.API_NAME
        };
        applyObj.caching_enabled = parseBool(envObj.REQUEST_CACHING);
        applyObj.auth_mode = (["jwt", "session"].includes(envObj.AUTH_MODE) ? envObj.AUTH_MODE : "jwt") as AuthModes;

        applyObj.deploy = {
            ip : envObj.DEPLOY_IP,
            user : envObj.DEPLOY_USER,
            path : envObj.DEPLOY_PATH,
            ref : envObj.DEPLOY_REF,
            repo : envObj.DEPLOY_REPO,
            key : envObj.DEPLOY_KEY
        }

        applyObj.jwt = {
            access_expires : parseInt(envObj.JWT_ACCESS_EXPIRATION_MINUTES, 10),
            refresh_expires : parseInt(envObj.JWT_REFRESH_EXPIRATION_MINUTES, 10),
            secret : envObj.JWT_SECRET
        };

        applyObj.elastic = {
            enabled : parseBool(envObj.ELASTIC_ENABLE),
            url : envObj.ELASTIC_URL
        };

        applyObj.facebook = {
            id : envObj.FACEBOOK_KEY,
            redirect : envObj.FACEBOOK_REDIRECT_URL,
            secret : envObj.FACEBOOK_SECRET
        };

        applyObj.outlook = {
            id : envObj.OUTLOOK_KEY,
            redirect : envObj.OUTLOOK_REDIRECT_URL,
            secret : envObj.OUTLOOK_SECRET
        };

        applyObj.google = {
            id : envObj.GOOGLE_KEY,
            redirect : envObj.GOOGLE_REDIRECT_URL,
            secret : envObj.GOOGLE_SECRET
        };

        applyObj.typeorm = {
            database: envObj.TYPEORM_DB,
            host: envObj.TYPEORM_HOST,
            name: envObj.TYPEORM_NAME,
            port: parseInt(envObj.TYPEORM_PORT, 10),
            pwd: envObj.TYPEORM_PWD,
            synchronize : parseBool(envObj.TYPEORM_SYNCHRONIZE),
            entities : envObj.TYPEORM_ENTITIES.split(","),
            type: (["mariadb", "mysql", "oracle", "mongodb"].includes(envObj.TYPEORM_TYPE) ?
                envObj.TYPEORM_TYPE : "mysql"
            ) as SupportedDatabasesTypes,
            user: envObj.TYPEORM_USER,
            tableName : envObj.TYPEORM_MIGRATIONS_TABLE_NAME,
            entitiesDir : envObj.TYPEORM_ENTITIES_DIR,
            migrationsDir : envObj.TYPEORM_MIGRATIONS_DIR,
            migrations : envObj.TYPEORM_MIGRATIONS.split(","),
            seeds : envObj.TYPEORM_SEEDING_SEEDS,
            factories : envObj.TYPEORM_SEEDING_FACTORIES
        };

        applyObj.jimp = {
            isActive: parseBool(envObj.JIMP_IS_ACTIVE),
            md: parseInt(envObj.JIMP_SIZE_MD, 10),
            xl: parseInt(envObj.JIMP_SIZE_XL, 10),
            xs: parseInt(envObj.JIMP_SIZE_XS, 10)
        };

        applyObj.https = {
            ca: envObj.HTTPS_CHAIN,
            cert: envObj.HTTPS_CERT,
            isActive: parseBool(envObj.HTTPS_IS_ACTIVE),
            key: envObj.HTTPS_KEY
        };

        applyObj.mailgun = {
            domain : envObj.MAILGUN_DOMAIN,
            host : envObj.MAILGUN_HOST,
            privateKey : envObj.MAILGUN_API_KEY,
            publicKey : envObj.MAILGUN_PUBLIC_KEY
        };

        return applyObj;
    }
}
