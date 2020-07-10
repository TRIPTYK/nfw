// During the test the env variable is set to test
process.env.NODE_ENV = "test";

// Require modules to test
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgInfo = require(process.cwd() + "/package.json");

// Require the dev-dependencies
import * as request from "supertest";
import {expect} from "chai";


describe("Express application", function() {
    it("Express instance type is function", function() {
        expect(typeof (global["server"])).to.equal("function");
    });

    it("Express server version is 4.17.1", function() {
        expect(pkgInfo.dependencies.express.slice(1)).to.equal("4.17.1");
    });

    it("API status is OK 200", function(done) {
        request(global["server"])
            .get("/api/v1/status")
            .expect(200, done);
    });
});
