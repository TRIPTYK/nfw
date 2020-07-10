import { useRefreshDatabase, useSeeding, tearDownDatabase } from "typeorm-seeding";

exports.mochaHooks = {
    async beforeAll() {
        global["server"] = await import("./../src/app.bootstrap");
    }
};
