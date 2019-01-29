var request = require('supertest');
var uuid = require('uuid/v4');

describe("Route's validation", function () {
  
  var server, agent, token;

  before(function (done) {

    let expect = require('chai').expect;
    let express = require('./../dist/app.bootstrap')
    let credentials = {
      username: 'triptyk',
      email: 'steve@triptyk.eu',
      password: 'e2q2mak7'
    };

    server = express.App;
    agent = request.agent(server);

    agent
      .post('/api/v1/auth/login')
      .send(credentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
        token = response.body.token.accessToken;
        done();
      });
  });
  
  after(function () {
    server = undefined;
    delete server;
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
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/login rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/login')
          .expect(400, done);
      });
  
      it('POST /api/v1/auth/refresh-token rejected as 400', function (done) {
        request(server)
          .post('/api/v1/auth/refresh-token')
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