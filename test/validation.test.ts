import * as request from "supertest";
import {expect} from "chai";

describe("Route's validation", function () {
  let agent, token;

  before(function (done) {
      agent = request.agent(global['server']);
      token = global['login'].token;
      done();
  });

  describe("Bad formed id parameter", function() {

    describe("Users", function() {

        it('GET /api/v1/users/a rejected as 400', function (done) {
        agent
          .get('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
            .expect(400, done);
      });

        it('PUT /api/v1/users/a rejected as 400', function (done) {
        agent
          .put('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
            .expect(400, done);
      });

        it('PATCH /api/v1/users/a rejected as 400', function (done) {
        agent
          .patch('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
            .expect(400, done);
      });

        it('DELETE /api/v1/users/a rejected as 400', function (done) {
        agent
          .delete('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
            .expect(400, done);
      });

    });

    describe("Documents", function() {

      it('GET /api/v1/documents/a rejected as 400', function (done) {
        agent
          .get('/api/v1/documents/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

      it('PUT /api/v1/documents/a rejected as 400', function (done) {
        agent
          .put('/api/v1/documents/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

      it('PATCH /api/v1/documents/a rejected as 400', function (done) {
        agent
          .patch('/api/v1/documents/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

      it('DELETE /api/v1/documents/a rejected as 400', function (done) {
        agent
          .delete('/api/v1/documents/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

    });

  });
  
  describe("Empty payload", function() {

    describe("Authentification", function() {

      it('POST /api/v1/auth/register rejected as 400', function (done) {
        agent
          .post('/api/v1/auth/register')
          .send({})
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/login rejected as 400', function (done) {
        agent
          .post('/api/v1/auth/login')
          .send({})
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/refresh-token rejected as 400', function (done) {
        agent
          .post('/api/v1/auth/refresh-token')
          .set('Accept', 'application/vnd.api+json')
          .set('Content-Type', 'application/vnd.api+json')
          .send({})
          .expect(400, done);
      });
    });

    describe("Users", function() {

      it('POST /api/v1/users rejected as 400', function (done) {
        agent
          .post('/api/v1/users')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

      it('PUT /api/v1/users/1 rejected as 400', function (done) {
        agent
          .put('/api/v1/users/1')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400, done);
      });

    });

  });
  
});