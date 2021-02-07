import { expect } from "chai";
import * as request from "supertest";
import { runSeeder, useRefreshDatabase, useSeeding } from "typeorm-seeding";
import CreateAuthUserSeed from "../src/seed/create-auth-user.seed";
import { ServerContainer } from "./utils/server";

describe("Authentification", () => {
    let agent;
    let credentials;
    let localRefreshToken: string;

    before(async () => {
        agent = request.agent(ServerContainer.server);
        await useRefreshDatabase({ configName: "ormconfig.ts" });
        await useSeeding({ configName: "ormconfig.ts" });
        await runSeeder(CreateAuthUserSeed);
    });

    describe("Register", () => {
        it("POST api/v1/auth/register succeed with 201", (done) => {
            agent
                .post("/api/v1/auth/register")
                .send({
                    data: {
                        attributes: {
                            email: "jacky@localhost.com",
                            password: "Complexity*123",
                            firstname: "jacky",
                            lastname: "Jack",
                            username: "maboul"
                        }
                    }
                })
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .end((err, res) => {
                    expect(res.statusCode).to.equal(201);
                    done();
                });
        });

        it("POST api/v1/auth/register failed with 400 (email or username already taken)", (done) => {
            agent
                .post("/api/v1/auth/register")
                .send({
                    data: {
                        attributes: credentials
                    }
                })
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .expect(400, done);
        });
    });

    describe("Login", () => {
        it("Authentification succeed with good credentials", (done) => {
            agent
                .post("/api/v1/auth/login")
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .send({
                    email: "admin@localhost.com",
                    password: "admin"
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    localRefreshToken = res.body.refreshToken;
                    done();
                });
        });

        it("Authentification failed with bad password", (done) => {
            agent
                .post("/api/v1/auth/login")
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .send({
                    email: "admin@localhost.com",
                    password: "GastonTrahison"
                })
                .expect(401, done);
        });

        it("Authentification failed with bad email", (done) => {
            agent
                .post("/api/v1/auth/login")
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .send({
                    email: "fake@gmail.com",
                    password: "admin"
                })
                .expect(404, done);
        });
    });

    describe("Refresh token", () => {
        it("POST api/v1/auth/refresh-token succeed with 200", (done) => {
            agent
                .post("/api/v1/auth/refresh-token")
                .set("Accept", "application/vnd.api+json")
                .set("Content-Type", "application/vnd.api+json")
                .send({
                    refreshToken: localRefreshToken
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });
});
