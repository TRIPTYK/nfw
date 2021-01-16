// During the test the env variable is set to test
process.env.NODE_ENV = "test";

// Require modules to test
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgInfo = require(`${process.cwd()}/package.json`);

// Require the dev-dependencies
import * as request from "supertest";
import { expect } from "chai";
import { ServerContainer } from "./utils/server";

describe("Express application", () => {
    it("Express instance type is function", () => {
        expect(typeof ServerContainer.innerInstance).to.equal("function");
    });

    it("API status is OK 200", (done) => {
        request(ServerContainer.innerInstance)
            .get("/api/v1/status")
            .expect(200, done);
    });
});
