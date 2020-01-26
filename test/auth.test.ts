import * as request from "supertest";
import * as fixtures from "./fixtures/index";
import {expect} from "chai";
import * as faker from "faker";

describe("Authentification", function() {
  let agent;
  let credentials;
  let localRefreshToken: string;
  let localAccessToken: string;

  before(function(done) {
    agent = request.agent(global["server"]);
    credentials = fixtures.user({
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(8, true),
        role: "admin",
        services: {},
        username: faker.internet.userName(),
    });
    done();
  });

  describe("Register", function() {

    it("POST api/v1/auth/register succeed with 201", function(done) {
      agent
        .post("/api/v1/auth/register")
        .send({
            data : {
                attributes : credentials
            }
        })
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .expect(201, done);
    });

    it("POST api/v1/auth/register failed with 400 (email or username already taken)", function(done) {
      agent
        .post("/api/v1/auth/register")
        .send({
            data : {
                attributes : credentials
            }
        })
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
          .expect(400, done);
    });
  });

  describe("Login", function() {

    it("Authentification succeed with good credentials", function(done) {
      agent
        .post("/api/v1/auth/login")
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .send({
            email: credentials.email,
            password: credentials.password
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          localAccessToken = res.body["accessToken"];
          localRefreshToken = res.body["refreshToken"];
          done();
        });
    });

    it("Authentification failed with bad password", function(done) {
      agent
        .post("/api/v1/auth/login")
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .send({
          email: credentials.email,
          password: "GastonTrahison"
        })
        .expect(401, done);
    });

    it("Authentification failed with bad email", function(done) {
      agent
        .post("/api/v1/auth/login")
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .send({
          email: "fake@gmail.com",
          password: credentials.password
        })
        .expect(404, done);
    });

  });

  describe("Refresh token", function() {

    it("POST api/v1/auth/refresh-token succeed with 200", function(done) {
      agent
        .post("/api/v1/auth/refresh-token")
        .set("Authorization", "Bearer " + localAccessToken)
        .set("Accept", "application/vnd.api+json")
        .set("Content-Type", "application/vnd.api+json")
        .send({
          token: localRefreshToken
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          localAccessToken = res.body["accessToken"];
          localRefreshToken = res.body["refreshToken"];
          done();
        });
    });

  });

  describe("Unauthorized without token", function() {

    describe("Users", function() {

      it("GET /api/v1/users rejected with 403", function(done) {
        agent
          .get("/api/v1/users")
          .expect(403, done);
      });

      it("GET /api/v1/users/1 rejected with 403", function(done) {
        agent
          .get("/api/v1/users/1")
          .expect(403, done);
      });

      it("GET /api/v1/users/profile rejected with 403", function(done) {
        agent
          .get("/api/v1/users/profile")
          .expect(403, done);
      });

      it("POST /api/v1/users rejected with 403", function(done) {
        agent
          .post("/api/v1/users")
          .expect(403, done);
      });

      it("PUT /api/v1/users/1 rejected with 403", function(done) {
        agent
          .put("/api/v1/users/1")
          .expect(403, done);
      });

      it("PATCH /api/v1/users/1 rejected with 403", function(done) {
        agent
          .patch("/api/v1/users/1")
          .expect(403, done);
      });

      it("DELETE /api/v1/users/1 rejected as 403", function(done) {
        agent
          .delete("/api/v1/users/1")
          .expect(403, done);
      });

    });

    describe("Documents", function() {

      it("GET /api/v1/documents rejected with 403", function(done) {
        agent
          .get("/api/v1/documents")
          .expect(403, done);
      });

      it("POST /api/v1/documents rejected with 403", function(done) {
        agent
          .post("/api/v1/documents")
          .expect(403, done);
      });

      it("PUT /api/v1/documents rejected with 403", function(done) {
        agent
          .put("/api/v1/documents/1")
          .expect(403, done);
      });

      it("PATCH /api/v1/documents rejected with 403", function(done) {
        agent
          .patch("/api/v1/documents/1")
          .expect(403, done);
      });

      it("DELETE /api/v1/documents rejected with 403", function(done) {
        agent
          .delete("/api/v1/documents/1")
          .expect(403, done);
      });

    });

  });

});
