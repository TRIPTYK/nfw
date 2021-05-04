import { expect } from "chai";
import * as request from "supertest";
import { runSeeder, useRefreshDatabase, useSeeding } from "typeorm-seeding";
import { User } from "../api/models/user.model";
import { CreateAuthUserSeed } from "../seed/create-auth-user.seed";
import { ServerContainer } from "./utils/server";

describe("Document CRUD", () => {
    let agent: request.SuperTest<request.Test>;
    let id: number | string;
    let accessToken;

    before(async () => {
        agent = request.agent(ServerContainer.server);
        await useRefreshDatabase({ configName: "ormconfig.ts" });
        await useSeeding({ configName: "ormconfig.ts" });
        const user: User = await runSeeder(CreateAuthUserSeed);
        accessToken = user.generateAccessToken();
    });

    it("POST succeed as 201 on /api/v1/documents (file upload)", (done) => {
        agent
            .post("/api/v1/documents")
            .attach("document", "test/fixtures/documents/img.png")
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${accessToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                id = res.body.data.id;
                done();
            });
    });

    it("POST failed with wrong file format", (done) => {
        agent
            .post("/api/v1/documents")
            .attach("document", "test/fixtures/documents/text.exe")
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${accessToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(415);
                done();
            });
    });

    it("GET succeed as 200 on /api/v1/documents", (done) => {
        agent
            .get(`/api/v1/documents/${id}`)
            .set("Accept", "application/vnd.api+json")
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${accessToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("PATCH succeed as 200 on /api/v1/documents/n", (done) => {
        agent
            .patch(`/api/v1/documents/${id}`)
            .set("Accept", "application/vnd.api+json")
            .set("Authorization", `Bearer ${accessToken}`)
            .attach("document", "test/fixtures/documents/img_2.png")
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("DELETE succeed as 204 on /api/v1/documents/n", (done) => {
        agent
            .delete(`/api/v1/documents/${id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(204, done);
    });
});
