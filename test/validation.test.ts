import * as request from "supertest";
import * as fixtures from "./fixtures";
import {expect} from "chai";

describe("Route's validation", function () {

  let server, agent, password, credentials, token, refreshToken;

  before(function (done) {
    let express = require('./../src/app.bootstrap');

    server      = express.App;
    agent       = request.agent(server);
    password    = fixtures.password();
    credentials = { data : { attributes : fixtures.user('admin', password) } };

    agent
      .post('/api/v1/auth/register')
      .send(credentials)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .end(function(err, response){
        expect(response.statusCode).to.equal(201);
        token = response.body.token.accessToken;
        refreshToken = response.body.token.refreshToken;
        done();
      });
  });
  
  after(function () {
    server = undefined;
  });

  describe("Bad formed id parameter", function() {

    describe("Users", function() {

      it('GET /api/v1/users/a rejected as 417', function (done) {
        agent
          .get('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(417, done);
      });

      it('PUT /api/v1/users/a rejected as 417', function (done) {
        agent
          .put('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(417, done);
      });

      it('PATCH /api/v1/users/a rejected as 417', function (done) {
        agent
          .patch('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(417, done);
      });

      it('DELETE /api/v1/users/a rejected as 417', function (done) {
        agent
          .delete('/api/v1/users/a')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(417, done);
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
        request(server)
          .post('/api/v1/auth/register')
          .send({})
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/login rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/login')
          .send({})
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/refresh-token rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/refresh-token')
          .set('Accept', 'application/vnd.api+json')
          .set('Content-Type', 'application/vnd.api+json')
          .send({})
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/facebook rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/facebook')
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/google rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/google')
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