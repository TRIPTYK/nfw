import { ServerContainer } from "./utils/server";

exports.mochaHooks = {
    async beforeAll() {
        await ServerContainer.init("./../../src/app.bootstrap");
    }
};
