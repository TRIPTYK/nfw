interface RelationshipOptions {
    type: string;
    alternativeKey?: string;
    schema?: string;
    links?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    meta?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    deserialize?: (data: {
        [key: string]: string;
    }) => { [key: string]: string };
}

interface Options {
    id?: string;
    blacklist?: string[];
    whitelist?: string[];
    jsonapiObject?: boolean;
    links?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    topLevelLinks?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    topLevelMeta?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    meta?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    relationships?: {
        [x: string]: RelationshipOptions;
    };
    blacklistOnDeserialize?: string[];
    whitelistOnDeserialize?: string[];
    convertCase?: "kebab-case" | "snake_case" | "camelCase";
    unconvertCase?: "kebab-case" | "snake_case" | "camelCase";
    convertCaseCacheSize?: number;
    beforeSerialize?: (data: {
        [key: string]: string;
    }) => { [key: string]: string };
    afterDeserialize?: (data: {
        [key: string]: string;
    }) => { [key: string]: string };
}

interface DynamicTypeOptions {
    type: (data: { [key: string]: string }) => string;
    jsonapiObject?: boolean;
    topLevelLinks?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
    topLevelMeta?:
        | ((
              data: { [key: string]: string },
              extraData: any
          ) => { [key: string]: string })
        | {
              [key: string]:
                  | string
                  | ((
                        data: { [key: string]: string },
                        extraData: any
                    ) => string);
          };
}

type ErrorWithStatus = Error;

declare namespace JSONAPISerializer {
    export {
        RelationshipOptions,
        Options,
        ErrorWithStatus,
        DynamicTypeOptions
    };
}

declare class JSONAPISerializer {
    constructor(opts?: Options);
    register(type: string, options?: Options): void;
    register(type: string, schema?: string, options?: Options): void;
    serialize(
        type: string | DynamicTypeOptions,
        data: any | any[],
        schema?: string | { [key: string]: string },
        extraData?: any,
        excludeData?: boolean,
        overrideSchemaOptions?: { [key: string]: string }
    ): any;
    serializeAsync(
        type: string | DynamicTypeOptions,
        data: any | any[],
        schema?: string,
        extraData?: any,
        excludeData?: boolean,
        overrideSchemaOptions?: { [key: string]: string }
    ): Promise<any>;
    deserialize(
        type: string | DynamicTypeOptions,
        data: any,
        schema?: string
    ): any;
    deserializeAsync(
        type: string | DynamicTypeOptions,
        data: any,
        schema?: string
    ): Promise<any>;
    serializeError(
        error:
            | Error
            | Error[]
            | ErrorWithStatus
            | ErrorWithStatus[]
            | { [key: string]: string }
            | { [key: string]: string }[]
    ): Promise<any>;
}

export = JSONAPISerializer;
