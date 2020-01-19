import * as fs from "fs";
import * as dotenv from "dotenv";
import { parseBool } from "../api/utils/string-parse.util";
import { Environments } from "../api/enums/environments.enum";

// tslint:disable-next-line: interface-over-type-literal
type Configuration = {
    env?: Environments;
    port?: number;
    url?: string;
    authorized?: string;
    api?: string;
    caching_enabled?: boolean;
    jwt?: {
        authMode: JwtAuthModes,
        expires: number,
        secret: string
    };
    elastic?: {
        enabled: boolean,
        url: string
    };
    facebook?: {
        id: string,
        redirect: string,
        secret: string
    };
    outlook?: {
        id: string,
        redirect: string,
        secret: string
    };
    google?: {
        id: string,
        redirect: string,
        secret: string
    };
    typeorm?: {
        database: string,
        host: string,
        name: string,
        port: number,
        pwd: string,
        type: string,
        user: string
    };
    jimp?: {
        isActive: boolean,
        md: number,
        xl: number,
        xs: number
    };
    https?: {
        ca: string,
        cert: string,
        isActive: boolean,
        key: string
    };
};

type JwtAuthModes = "normal" | "multiple" | "single";

export default class EnvironmentConfiguration {

    public static get config(): Configuration {
        if (!EnvironmentConfiguration.env) {
            throw new Error("Environment not loaded");
        }
        return EnvironmentConfiguration.env;
    }

    public static loadEnvironment(env: string = "development"): Configuration {
        return EnvironmentConfiguration.env = EnvironmentConfiguration.getEnvironment(env);
    }

    public static getEnvironment(env: string = "development"): Configuration {
        const loaded = dotenv.parse(fs.readFileSync(`${process.cwd()}/${env}.env`));
        return EnvironmentConfiguration.buildEnvObject(loaded);
    }

    private static  env: Configuration;

    private static buildEnvObject(envObj: dotenv.DotenvParseOutput): Configuration {
        const applyObj: Configuration = {};

        applyObj.env = (["production", "test", "staging", "development"].includes(envObj.NODE_ENV) ? envObj.NODE_ENV : "development") as Environments;
        applyObj.port = parseInt(envObj.PORT, 10);
        applyObj.url = envObj.URL;
        applyObj.authorized = envObj.AUTHORIZED;
        applyObj.api = envObj.API_VERSION;
        applyObj.caching_enabled = parseBool(envObj.REQUEST_CACHING);

        applyObj.jwt = {
            authMode : (["normal", "multiple", "single"].includes(envObj.JWT_AUTH_MODE) ? envObj.JWT_AUTH_MODE : "normal") as JwtAuthModes,
            expires : parseInt(envObj.JWT_EXPIRATION_MINUTES, 10),
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
            type: envObj.TYPEORM_TYPE,
            user: envObj.TYPEORM_USER
        };

        applyObj.jimp = {
            isActive: parseBool(process.env.JIMP_IS_ACTIVE),
            md: parseInt(process.env.JIMP_SIZE_MD, 10),
            xl: parseInt(process.env.JIMP_SIZE_XL, 10),
            xs: parseInt(process.env.JIMP_SIZE_XS, 10)
        };

        applyObj.https = {
            ca: process.env.HTTPS_CHAIN,
            cert: process.env.HTTPS_CERT,
            isActive: parseBool(process.env.HTTPS_IS_ACTIVE),
            key: process.env.HTTPS_KEY
        };

        return applyObj;
    }
}
