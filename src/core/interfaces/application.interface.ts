import { Type } from "../types/global";
import BaseController from "../controllers/base.controller";

export default interface ApplicationInterface {
    init(): Promise<any>;
    setupMiddlewares(middlewares: { middleware: any ; args: object }[]): Promise<any>;
    setupControllers(controllers: Type<BaseController>[]): Promise<any>;
    afterInit(): Promise<any>;
    listen(port: number);
}
