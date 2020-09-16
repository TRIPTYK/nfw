import { Type } from "../types/global";
import BaseController from "../controllers/base.controller";
import { MiddlewareMetadata } from "../decorators/controller.decorator";

export default interface ApplicationInterface {
    init(): Promise<any>;
    setupMiddlewares(middlewares: MiddlewareMetadata[]): Promise<any>;
    setupControllers(controllers: Type<BaseController>[]): Promise<any>;
    afterInit(): Promise<any>;
    listen(port: number);
}
