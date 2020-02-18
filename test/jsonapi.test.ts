import * as chai from "chai";
import * as request from "supertest";
import * as fixtures from "./fixtures";
import {expect} from "chai";
import * as faker from "faker";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../src/api/models/user.model";
import { Document } from "../src/api/models/document.model";
import { DocumentTypes } from "../src/api/enums/document-type.enum";
import { MimeTypes } from "../src/api/enums/mime-type.enum";
import { response } from "express";

chai.config.includeStack = false;
chai.config.truncateThreshold = 1;

describe("JSON-API Tests on User", () => {
  let agent: request.SuperTest<request.Test>;
  let token: string;
  let user: User;
  let doc : Document;

  before(async () => {
    agent = request.agent(global["server"]);
    token = global["login"].accessToken;

    let tuser = new User(fixtures.user() as any);
    doc = new Document({
        fieldname : DocumentTypes.Picture,
        filename : "",
        size : 10,
        path : "/",
        mimetype: MimeTypes.JPEG
    });

    doc = await getRepository(Document).save(doc);
    user = await getRepository(User).save(tuser);
  });

  it("GET user/n has JSON-API Fields and valid response body", (done) => {
    agent
    .get(`/api/v1/users/${user.id}`)
    .set("Authorization", "Bearer " + token)
    .set("Accept", "application/vnd.api+json")
    .set("Content-Type", "application/vnd.api+json")
    .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(200);
        expect(res.body.jsonapi.version).to.equal("1.0");
        expect(res.body.data).to.be.a("object");
        expect(res.body.data.attributes).to.be.a("object");
        expect(res.body.data.type).to.equal("user");
        expect(res.body.data.id).to.equal(user.id.toString());
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

  it("POST relationship to avatar", (done) => {
    agent
    .post(`/api/v1/users/${user.id}/relationships/avatar`)
    .set("Authorization", "Bearer " + token)
    .set("Accept", "application/vnd.api+json")
    .set("Content-Type", "application/vnd.api+json")
    .send({
        data : {
          type : "documents",
          id : doc.id
        }
    })
    .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(204);
        done();
      });
  });

  it("PATCH relationship to avatar", (done) => {
    agent
    .patch(`/api/v1/users/${user.id}/relationships/avatar`)
    .set("Authorization", "Bearer " + token)
    .set("Accept", "application/vnd.api+json")
    .set("Content-Type", "application/vnd.api+json")
    .send({
        data : {
          type : "documents",
          id : doc.id
        }
    })
    .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(204);
        done();
      });
  });

  it("DELETE relationship to avatar", (done) => {
    agent
    .delete(`/api/v1/users/${user.id}/relationships/avatar`)
    .set("Authorization", "Bearer " + token)
    .set("Accept", "application/vnd.api+json")
    .set("Content-Type", "application/vnd.api+json")
    .end((err, res) => {
        const status = res.status;
        expect(status).to.equal(204);
        done();
      });
  });

  after( async () => {
      await getRepository(User).remove(user);
  });
});
