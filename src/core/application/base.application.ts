import * as Express from "express";
import ApplicationInterface from "../interfaces/application.interface";
import { ApplicationRegistry } from "./registry.application";

export default abstract class BaseApplication implements ApplicationInterface{
    protected app: Express.Application;
    protected router: Express.Router;

    public constructor() {
        this.app = Express();
        this.router = Express.Router();
    }

    public get App() {
        return this.app;
    }

    public listen(port: number) {
        return new Promise((resolve) => {
            this.app.listen(port, (server) => {
                resolve(server);
            });
        })
    }

    public init() {
        for (const entity in ApplicationRegistry.controllers) {
            const value = ApplicationRegistry.controllers[entity];

            const controller = new value();
        }
    }
}
