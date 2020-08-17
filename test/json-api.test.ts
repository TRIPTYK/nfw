import {expect} from "chai";
import * as request from "supertest";
import * as fixtures from "./fixtures";
import * as faker from "faker";
import { User } from "../src/api/models/user.model";
import { runSeeder, useRefreshDatabase, useSeeding, tearDownDatabase } from "typeorm-seeding";
import CreateAuthUserSeed from "../src/seed/create-auth-user.seed";

chai.config.includeStack = false;
chai.config.truncateThreshold = 1;

describe("JSON-API compliance test", () => {
    let agent: request.SuperTest<request.Test>;
    let token: string;
    let id: string;

    before(async () => {
        agent = request.agent(global["server"]);
        await useRefreshDatabase({connection : "default"});
        await useSeeding({configName : "ormconfig.ts"});
        const user: User = await runSeeder(CreateAuthUserSeed);
        token = user.generateAccessToken();
    });
});
