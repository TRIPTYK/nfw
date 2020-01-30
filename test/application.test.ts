// During the test the env variable is set to test
process.env.NODE_ENV = "test";

// Require modules to test
const pkgInfo = require("./../package.json");

// Require the dev-dependencies
import * as request from "supertest";
import {expect} from "chai";
import * as fixtures from "./fixtures/index";
import * as faker from "faker";

before(async () => {
    global["server"] = await import("./../src/app.bootstrap");

    // global user
    const agent = request.agent(global["server"]);
    const credentials = fixtures.user({
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(8, true),
        role: "admin",
        services: {},
        username: faker.internet.userName(),
    });

    return agent
        .post("/api/v1/auth/register")
        .send(credentials)
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .then(function(response) {
            expect(response.status).to.equal(201);
            global["login"] = {
                accessToken: response.body["accessToken"],
                email : response.body.user["email"],
                refreshToken: response.body["refreshToken"],
                userId : response.body.user["id"]
            };
        });
});

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

after(async () => {
    await request(global["server"])
        .delete(`/api/v1/users/${global["login"]["userId"]}`)
        .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
        .then((response) => {
            delete global["server"];
            expect(response.status).to.equal(204);
        });
});
