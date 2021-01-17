export class ApiServer<T> {
    private _server: T;

    public get server() {
        return this._server;
    }

    public async init(serverPath: string) {
        const server = await import(serverPath);
        return (this._server = server);
    }
}

export class ServerContainer {
    private static _server: ApiServer<Express.Application>;

    public static get server() {
        return ServerContainer._server;
    }

    public static async init(serverPath: string) {
        const server = await new ApiServer().init(serverPath);
        return (ServerContainer._server = server);
    }
}
