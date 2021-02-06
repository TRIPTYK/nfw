import * as dotenv from "dotenv";
import { join } from "path";
import { singleton } from "tsyringe";
import { DatabaseType } from "typeorm";
import { parseBool } from "../utils/string-parse.util";
import BaseService from "./base.service";

export type Configuration = {
    env?: string;
    port?: number;
    url?: string;
    authorized?: string | string[];
    api?: {
        name: string;
        version: string;
    };
    cachingEnabled?: boolean;
    authMode?: string;
    jwt?: {
        refreshExpires: number;
        accessExpires: number;
        secret: string;
    };
    elastic?: {
        enabled: boolean;
        url: string;
    };
    facebook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    outlook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    google?: {
        id: string;
        redirect: string;
        secret: string;
    };
    typeorm?: {
        database: string;
        host: string;
        name: string;
        synchronize: boolean;
        entities: string[];
        port: number;
        pwd: string;
        type: DatabaseType;
        user: string;
        tableName: string;
        migrationsDir: string;
        entitiesDir: string;
        migrations: string[];
        seeds: string;
        factories: string;
    };
    deploy?: {
        ip: string;
        user: string;
        path: string;
        key: string;
        repo: string;
        ref: string;
    };
    jimp?: {
        isActive: boolean;
        md: number;
        xl: number;
        xs: number;
    };
    mailgun?: {
        privateKey: string;
        publicKey: string;
        domain: string;
        host: string;
    };
    https?: {
        ca: string;
        cert: string;
        isActive: boolean;
        key: string;
    };
    oAuthKey: string;
};

@singleton()
export default class ConfigurationService<
    T = Configuration
> extends BaseService {
    private _config: T;

    public get config(): T {
        return this._config;
    }

    public constructor() {
        super();
        this._config = this.loadConfiguration();
    }

    public loadConfiguration(): T {
        const { parsed: loaded } = dotenv.config({
            path: join(
                process.cwd(),
                `${process.env.NODE_ENV ?? "development"}.env`
            )
        });
        const applyObj: any = {};

        applyObj.env = loaded.NODE_ENV;
        applyObj.port = parseInt(loaded.PORT, 10);
        applyObj.url = loaded.URL;
        applyObj.authorized =
            loaded.AUTHORIZED === "*" ? true : loaded.AUTHORIZED.split(",");
        applyObj.api = {
            version: loaded.API_VERSION,
            name: loaded.API_NAME
        };
        applyObj.cachingEnabled = parseBool(loaded.REQUEST_CACHING);
        applyObj.authMode = ["jwt", "session"].includes(loaded.AUTH_MODE)
            ? loaded.AUTH_MODE
            : "jwt";

        applyObj.deploy = {
            ip: loaded.DEPLOY_IP,
            user: loaded.DEPLOY_USER,
            path: loaded.DEPLOY_PATH,
            ref: loaded.DEPLOY_REF,
            repo: loaded.DEPLOY_REPO,
            key: loaded.DEPLOY_KEY
        };

        applyObj.jwt = {
            accessExpires: parseInt(loaded.JWT_ACCESS_EXPIRATION_MINUTES, 10),
            refreshExpires: parseInt(loaded.JWT_REFRESH_EXPIRATION_MINUTES, 10),
            secret: loaded.JWT_SECRET
        };

        applyObj.elastic = {
            enabled: parseBool(loaded.ELASTIC_ENABLE),
            url: loaded.ELASTIC_URL
        };

        applyObj.facebook = {
            id: loaded.FACEBOOK_KEY,
            redirect: loaded.FACEBOOK_REDIRECT_URL,
            secret: loaded.FACEBOOK_SECRET
        };

        applyObj.outlook = {
            id: loaded.OUTLOOK_KEY,
            redirect: loaded.OUTLOOK_REDIRECT_URL,
            secret: loaded.OUTLOOK_SECRET
        };

        applyObj.google = {
            id: loaded.GOOGLE_KEY,
            redirect: loaded.GOOGLE_REDIRECT_URL,
            secret: loaded.GOOGLE_SECRET
        };

        applyObj.typeorm = {
            database: loaded.TYPEORM_DB,
            host: loaded.TYPEORM_HOST,
            name: loaded.TYPEORM_NAME,
            port: parseInt(loaded.TYPEORM_PORT, 10),
            pwd: loaded.TYPEORM_PWD,
            synchronize: parseBool(loaded.TYPEORM_SYNCHRONIZE),
            entities: loaded.TYPEORM_ENTITIES.split(","),
            type: ["mariadb", "mysql", "oracle", "postgresql"].includes(
                loaded.TYPEORM_TYPE
            )
                ? loaded.TYPEORM_TYPE
                : "mysql",
            user: loaded.TYPEORM_USER,
            tableName: loaded.TYPEORM_MIGRATIONS_TABLE_NAME,
            entitiesDir: loaded.TYPEORM_ENTITIES_DIR,
            migrationsDir: loaded.TYPEORM_MIGRATIONS_DIR,
            migrations: loaded.TYPEORM_MIGRATIONS.split(","),
            seeds: loaded.TYPEORM_SEEDING_SEEDS,
            factories: loaded.TYPEORM_SEEDING_FACTORIES
        };

        applyObj.jimp = {
            isActive: parseBool(loaded.JIMP_IS_ACTIVE),
            md: parseInt(loaded.JIMP_SIZE_MD, 10),
            xl: parseInt(loaded.JIMP_SIZE_XL, 10),
            xs: parseInt(loaded.JIMP_SIZE_XS, 10)
        };

        applyObj.https = {
            ca: loaded.HTTPS_CHAIN,
            cert: loaded.HTTPS_CERT,
            isActive: parseBool(loaded.HTTPS_IS_ACTIVE),
            key: loaded.HTTPS_KEY
        };

        applyObj.mailgun = {
            domain: loaded.MAILGUN_DOMAIN,
            host: loaded.MAILGUN_HOST,
            privateKey: loaded.MAILGUN_API_KEY,
            publicKey: loaded.MAILGUN_PUBLIC_KEY
        };

        applyObj.oAuthKey = loaded.OAUTH_KEY;

        return { ...loaded, ...applyObj };
    }

    public getKey(key: keyof T): T[keyof T] {
        return this._config[key];
    }

    public init() {
        // eslint-disable-next-line no-useless-return
        return;
    }
}
