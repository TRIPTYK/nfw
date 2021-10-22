import {
    BaseApplication
} from "@triptyk/nfw-core";
import { autoInjectable } from "tsyringe";
import { LoggerService } from "./services/logger.service";

@autoInjectable()
export class Application extends BaseApplication {
    public async afterInit(): Promise<any> {
        return true;
    }

    public constructor(
        private loggerService: LoggerService
    ) {
        super();
    }

    public listen(port: number) {
        return super.listen(port).then(() => {
            this.loggerService.logger.info(
                `HTTP server is now running on port ${port}`
            );
        });
    }
}
