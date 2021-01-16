export class ApiServer<T> {
    private _server: T;

    public get server() {
        return this._server;
    }

    public async init(serverPath: string) {
        return (this._server = await import(serverPath));
    }
}

export class ServerContainer {
    private static _server: ApiServer<Express.Application>;

    public static get server() {
        return ServerContainer._server;
    }

    public static get innerInstance() {
        return ServerContainer._server.server;
    }

    public static async init(serverPath: string) {
        return (ServerContainer._server = await new ApiServer().init(
            serverPath
        ));
    }
}
