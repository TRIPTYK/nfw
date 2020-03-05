import * as chai from "chai";
import * as request from "supertest";
import * as fixtures from "./fixtures";
import {expect} from "chai";
import * as faker from "faker";

chai.config.includeStack = false;
chai.config.truncateThreshold = 1;

describe("User CRUD", () => {
  let agent: request.SuperTest<request.Test>;
  let token: string;
  let id: string;

  before((done) => {
    agent = request.agent(global["server"]);
    token = global["login"].accessToken;
    agent
      // @ts-ignore
      .set("Accept", "application/vnd.api+json") 
      .set("Content-Type", "application/vnd.api+json");
    done();
  });

  it("POST /api/v1/users succeed with 201", (done) => {
    agent
      .post("/api/v1/users")
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .send({
        data : {
            attributes : fixtures.user({
                email: faker.internet.email(),
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                password: faker.internet.password(8, true),
                role: "admin",
                services: {},
                username: faker.internet.userName(),
            })
        }
      })
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(201);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username",
          "email",
          "firstname",
          "lastname",
          "role",
          "created-at",
          "updated-at"
        );
        id = res.body.data.id;
        done();
      });
  });

  it("GET /api/v1/users/profile succeed with 200", (done) => {
    agent
      .get("/api/v1/users/profile")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username",
          "email",
          "firstname",
          "lastname",
          "role",
          "created-at",
          "updated-at"
        );
        done();
      });
  });

  it("GET /api/v1/users/n succeed with 200", (done) => {
    agent
      .get("/api/v1/users/" + id)
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username",
            "email",
            "updated-at",
            "firstname",
            "lastname",
            "role",
            "created-at"
        );
        done();
      });
  });

  it("GET Json-api fields" , (done) => {
    agent
      .get(`/api/v1/users/${id}?fields=username`)
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username"
        );
        done();
      });
  });

  it("PUT /api/v1/users/n succeed with 200", (done) => {
    agent
      .put("/api/v1/users/" + id)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .send({
        data : {
            attributes : fixtures.user({
                email: faker.internet.email(),
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                password: faker.internet.password(8, true),
                role: "admin",
                services: {},
                username: faker.internet.userName(),
            })
        }
      })
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username",
          "email",
          "updated-at",
          "firstname",
          "lastname",
          "role",
          "created-at"
        );
        done();
      });
  });

  it("PATCH /api/v1/users/n succeed with 200", (done) => {
    agent
      .patch("/api/v1/users/" + id)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .send({
        data: {
            attributes : {
                firstName: faker.name.firstName(),
                lastname: faker.name.lastName(),
                username: faker.internet.userName()
            }
        }
      })
      .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.be.a("string");
        expect(res.body.data.attributes).to.include.all.keys(
          "username",
          "email",
          "firstname",
          "lastname",
          "role",
          "created-at",
          "updated-at"
        );
        done();
      });
  });

  it("DELETE /api/v1/users/n succeed with 204", (done) => {
    agent
      .delete("/api/v1/users/" + id)
      .set("Authorization", "Bearer " + token)
      .expect(204, done);
  });
});
