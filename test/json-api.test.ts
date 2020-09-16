import * as chai from "chai";
import * as request from "supertest";
import * as fixtures from "./fixtures";
import * as faker from "faker";
import { User } from "../src/api/models/user.model";
import { runSeeder, useRefreshDatabase, useSeeding, tearDownDatabase } from "typeorm-seeding";
import CreateAuthUserSeed from "../src/seed/create-auth-user.seed";
import { expect } from "chai";

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

    it("Servers MUST send all JSON:API data in response documents with the header Content-Type: application/vnd.api+json without any media type parameters." , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Authorization", "Bearer " + token)
            .set("Content-Type","application/vnd.api+json")
            .end((err, res) => {
                expect(res.header["content-type"]).to.equal("application/vnd.api+json; charset=utf-8");
                done();
            });
    });

    // it("Servers MUST respond with a 406 Not Acceptable status code if a request’s Accept header contains the JSON:API media type and all instances of that media type are modified with media type parameters." , (done) => {
    //     agent
    //         .get("/api/v1/users/")
    //         .set("Authorization", "Bearer " + token)
    //         .set("Content-Type","application/vnd.api+json")
    //         .set("Accept", "application/vnd.api+json; charset=utf-8")
    //         .end((err, res) => {
    //             expect(res.status).to.equal(406);
    //             done();
    //         });
    // });

    it("A JSON object MUST be at the root of every JSON:API request and response containing data. This object defines a document’s “top level”." , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body).to.be.a("object");
                done();
            })
    });

    it("A document MUST contain at least one of the following top-level members: data , errors , meta" , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body).to.have.ownProperty("data");
                done();
            })
    });

    it("A resource object MUST contain at least the following top-level members: id,type" , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.ownProperty("id");
                expect(res.body.data[0]).to.have.ownProperty("type");
                done();
            })
    });

    it("The value of the attributes key MUST be an object (an “attributes object”). Members of the attributes object (“attributes”) represent information about the resource object in which it’s defined." , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body.data[0].attributes).to.be.a("object");
                done();
            })
    });

    it("A server MUST support fetching resource data for every URL provided as" , (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body.links.self).to.be.a("string","a self link as part of the top-level links object");
                expect(res.body.data[0].links.self).to.be.a("string","a self link as part of a resource-level links object");
                expect(res.body.data[0].relationships.documents.links.self).to.be.a("string","a related link as part of a relationship-level links object");
                done();
            });
    });

    it("A server MUST respond to a successful request to fetch an individual resource or resource collection with a 200 OK response.", (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.status).to.eq(200);
                done();
            });
    });

    it("A server MUST respond to a successful request to fetch a resource collection with an array of resource objects or an empty array ([]) as the response document’s primary data.", (done) => {
        agent
            .get("/api/v1/users/")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body.data).to.an("array");
                done();
            });
    });

    it("A server MUST respond to a successful request to fetch an individual resource with a resource object or null provided as the response document’s primary data", (done) => {
        agent
            .get("/api/v1/users/1")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.body.data).to.satisfy((data) => typeof data === "object" || data === null);
                done();
            });
    });

    it("A server MUST respond with 404 Not Found when processing a request to fetch a single resource that does not exist, except when the request warrants a 200 OK response with null as the primary data (as described above).", (done) => {
        agent
            .get("/api/v1/users/500000000")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.status).to.eq(404);
                done();
            });
    });


    it ("A server MUST support fetching relationship data for every relationship URL provided as a self link as part of a relationship’s links object.", (done) => {
        agent
            .get("/api/v1/users/?include=documents")
            .set("Content-Type","application/vnd.api+json")
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                expect(res.status).to.eq(404);
                done();
            });
    });
});
