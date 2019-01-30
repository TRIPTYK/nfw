var request = require('supertest');
var uuid = require('uuid/v4');
var fixtures = require('./fixtures');

describe("Authentification", function () {
  
  var server, agent, password, credentials, token, refreshToken, id;
  var expect = require('chai').expect;

  before(function (done) {

    let express = require('./../dist/app.bootstrap');
  
    server      = express.App;
    agent       = request.agent(server);
    password    = fixtures.password();
    credentials = fixtures.user('admin', password);

    agent
      .post('/api/v1/auth/register')
      .send(credentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(201);
        token = response.body.token.accessToken;
        refreshToken = response.body.token.refreshToken;
        done();
      });

  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  describe("Register", function() {

    it('POST api/v1/auth/register succeed with 201', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send(fixtures.user('admin'))
        .expect(201, done);
    });

    it('POST api/v1/auth/register failed with 409 (email or username already taken)', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send(credentials)
        .expect(409, done);
    });

  });

  describe("Login", function() {

    it('Authentification succeed with good credentials', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200, done);
    });

    it('Authentification failed with bad password', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send({
          username: credentials.username,
          email: credentials.email,
          password: 'totoIsANoob'
        })
        .expect(417, done);
    });

    it('Authentification failed with bad email', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send({
          username: credentials.username,
          email: 'fake' + credentials.email,
          password: password
        })
        .expect(417, done);
    });

  });

  describe("Refresh token", function() {

    it('POST api/v1/auth/refresh-token succeed with 200', function (done) {
      request(server)
        .post('/api/v1/auth/refresh-token')
        .set('Authorization', 'Bearer ' + token)
        .send({
          email: credentials.email,
          password: password,
          refreshToken: refreshToken
        })
        .expect(200, done);
    });

  });

  describe("Unauthorized without token", function() {

    describe("Users", function() {

      it('GET /api/v1/users rejected with 403', function (done) {
        request(server)
          .get('/api/v1/users')
          .expect(403, done);
      });
  
      it('GET /api/v1/users/1 rejected with 403', function (done) {
        request(server)
          .get('/api/v1/users/1')
          .expect(403, done);
      });

      it('GET /api/v1/users/profile rejected with 403', function (done) {
        request(server)
          .get('/api/v1/users/profile')
          .expect(403, done);
      });

      it('POST /api/v1/users rejected with 403', function (done) {
        request(server)
          .post('/api/v1/users')
          .expect(403, done);
      });
  
      it('PUT /api/v1/users/1 rejected with 403', function (done) {
        request(server)
          .put('/api/v1/users/1')
          .expect(403, done);
      });
  
      it('PATCH /api/v1/users/1 rejected with 403', function (done) {
        request(server)
          .patch('/api/v1/users/1')
          .expect(403, done);
      });
  
      it('DELETE /api/v1/users/1 rejected as 403', function (done) {
        request(server)
          .delete('/api/v1/users/1')
          .expect(403, done);
      });

    });

    describe("Documents", function() {

      it('GET /api/v1/documents rejected with 403', function (done) {
        request(server)
          .get('/api/v1/documents')
          .expect(403, done);
      });

      it('POST /api/v1/documents rejected with 403', function (done) {
        request(server)
          .post('/api/v1/documents')
          .expect(403, done);
      });
  
      it('PUT /api/v1/documents rejected with 403', function (done) {
        request(server)
          .put('/api/v1/documents/1')
          .expect(403, done);
      });
  
      it('PATCH /api/v1/documents rejected with 403', function (done) {
        request(server)
          .patch('/api/v1/documents/1')
          .expect(403, done);
      });
  
      it('DELETE /api/v1/documents rejected with 403', function (done) {
        request(server)
          .delete('/api/v1/documents/1')
          .expect(403, done);
      });

    });

  });

});