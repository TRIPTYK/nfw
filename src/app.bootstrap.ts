import { ApplicationRegistry, ConfigurationService } from "@triptyk/nfw-core";
import "reflect-metadata";
import { container } from "tsyringe";
import { Application } from "./api/application";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const app = await ApplicationRegistry.registerApplication(Application);
    await app.listen(
        container
            .resolve<ConfigurationService>(ConfigurationService)
            .getKey("port") as number
    );
    return app.App;
})();
