import * as chai from "chai";
import { expect } from "chai";
import * as faker from "faker";
import * as request from "supertest";
import {
    runSeeder,
    tearDownDatabase,
    useRefreshDatabase,
    useSeeding
} from "typeorm-seeding";
import { Roles } from "../api/enums/role.enum";
import { User } from "../api/models/user.model";
import { CreateAuthUserSeed } from "../seed/create-auth-user.seed";
import { ServerContainer } from "./utils/server";

chai.config.includeStack = false;
chai.config.truncateThreshold = 1;

describe("User CRUD", () => {
    let agent: request.SuperTest<request.Test>;
    let token: string;
    let id: string;

    before(async () => {
        agent = request.agent(ServerContainer.server);
        await useRefreshDatabase({ connection: "default" });
        await useSeeding({ configName: "ormconfig.ts" });
        const user: User = await runSeeder(CreateAuthUserSeed);
        token = user.generateAccessToken();
        agent
            // @ts-ignore
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json");
    });

    it("POST /api/v1/users succeed with 201", (done) => {
        agent
            .post("/api/v1/users")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json")
            .send({
                data: {
                    attributes: {
                        email: faker.internet.email(),
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        password: faker.internet.password(8, true),
                        role: Roles.Admin,
                        username: faker.internet.userName()
                    }
                }
            })
            .end((err, res) => {
                const status = res.status;
                console.log(res.body);
                expect(status).to.equal(201);
                expect(res.body.data.type).to.equal("users");
                expect(res.body.data.id).to.be.a("string");
                expect(res.body.data.attributes).to.include.all.keys(
                    "username",
                    "email",
                    "firstName",
                    "lastName",
                    "role",
                    "createdAt",
                    "updatedAt",
                    "deletedAt"
                );
                id = res.body.data.id;
                done();
            });
    });

    it("GET /api/v1/users/profile succeed with 200", (done) => {
        agent
            .get("/api/v1/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                expect(res.body.data.type).to.equal("users");
                expect(res.body.data.id).to.be.a("string");
                expect(res.body.data.attributes).to.include.all.keys(
                    "username",
                    "email",
                    "firstName",
                    "lastName",
                    "role",
                    "createdAt",
                    "updatedAt",
                    "deletedAt"
                );
                done();
            });
    });

    it("GET /api/v1/users/n succeed with 200", (done) => {
        agent
            .get(`/api/v1/users/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                expect(res.body.data.type).to.equal("users");
                expect(res.body.data.id).to.be.a("string");
                expect(res.body.data.attributes).to.include.all.keys(
                    "username",
                    "email",
                    "firstName",
                    "lastName",
                    "role",
                    "createdAt",
                    "updatedAt",
                    "deletedAt"
                );
                done();
            });
    });

    it("GET Json-api fields", (done) => {
        agent
            .get(`/api/v1/users/${id}?fields=username`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                expect(res.body.data.type).to.equal("users");
                expect(res.body.data.id).to.be.a("string");
                expect(res.body.data.attributes).to.include.all.keys(
                    "username"
                );
                done();
            });
    });

    it("GET related", (done) => {
        agent
            .get(`/api/v1/users/${id}/documents`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                done();
            });
    });

    it("GET relationships", (done) => {
        agent
            .get(`/api/v1/users/${id}/relationships/documents`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                done();
            });
    });

    it("PATCH /api/v1/users/n succeed with 200", (done) => {
        agent
            .patch(`/api/v1/users/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json")
            .send({
                data: {
                    attributes: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        username: faker.internet.userName()
                    }
                }
            })
            .end((err, res) => {
                const status = res.status;
                expect(status).to.equal(200);
                expect(res.body.data.type).to.equal("users");
                expect(res.body.data.id).to.be.a("string");
                expect(res.body.data.attributes).to.include.all.keys(
                    "username",
                    "email",
                    "firstName",
                    "lastName",
                    "role",
                    "createdAt",
                    "updatedAt",
                    "deletedAt"
                );
                done();
            });
    });

    it("DELETE /api/v1/users/n succeed with 204", (done) => {
        agent
            .delete(`/api/v1/users/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204, done);
    });

    after(async () => {
        await tearDownDatabase();
    });
});
