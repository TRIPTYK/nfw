import * as request from "supertest";
import {expect} from "chai";
import * as Faker from "faker";

describe("Document CRUD", function() {
  let agent: request.SuperTest<request.Test>;
  let id: number | string;

  before(function(done) {
    agent = request.agent(global["server"]);
    done();
  });

  it("POST succeed as 201 on /api/v1/documents (file upload)", function(done) {
    agent
      .post("/api/v1/documents")
      .attach("document", "test/fixtures/documents/img.png")
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        id = res.body.data.id;
        done();
      });
  });

  it("POST failed with wrong file format", function(done) {
    agent
      .post("/api/v1/documents")
      .attach("document", "test/fixtures/documents/text.txt")
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
      .end(function(err, res) {
        expect(res.status).to.equal(415);
        done();
      });
  });

  it("GET succeed as 200 on /api/v1/documents", function(done) {
    agent
      .get(`/api/v1/documents/${id}`)
      .set("Accept", "application/vnd.api+json")
      .set("Content-Type", "application/vnd.api+json")
      .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("PUT succeed as 200 on /api/v1/documents/n", function(done) {
    agent
      .put(`/api/v1/documents/${id}`)
      .set("Accept", "application/vnd.api+json")
      .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
      .attach("document", "test/fixtures/documents/img_2.png")
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("DELETE succeed as 204 on /api/v1/documents/n", function(done) {
    agent
      .delete(`/api/v1/documents/${id}`)
      .set("Authorization", `Bearer ${global["login"]["accessToken"]}`)
      .expect(204, done);
  });
});
