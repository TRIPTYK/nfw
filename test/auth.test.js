var request = require('supertest');
var fixtures = require('./fixtures');

describe("Authentification", function () {
  
  var server, agent, password, credentials, token, refreshToken, id;
  var expect = require('chai').expect;

  before(function (done) {

    let express = require('../dist/app.bootstrap');
  
    server      = express.App;
    agent       = request.agent(server);
    password    = fixtures.password();
    credentials = { 
      data: { attributes: fixtures.user('admin', password) }
    }

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
    delete server;
  });

  describe("Register", function() {

    it('POST api/v1/auth/register succeed with 201', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send({ data :  { attributes : fixtures.user('admin') } })
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .expect(201, done);
    });

    it('POST api/v1/auth/register failed with 409 (email or username already taken)', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send(credentials)
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .expect(409, done);
    });

  });

  describe("Login", function() {

    it('Authentification succeed with good credentials', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send({
          username: credentials.data.attributes.username,
          email: credentials.data.attributes.email,
          password: password
        })    
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          refreshToken = res.body.token.refreshToken;
          done()
        });
    });

    it('Authentification failed with bad password', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send({
          username: credentials.data.attributes.username,
          email: credentials.data.attributes.email,
          password: 'totoIsANoob'
        })
        .expect(417, done);
    });

    it('Authentification failed with bad email', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send({
          username: credentials.data.attributes.username,
          email: 'fake' + credentials.data.attributes.email,
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
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
        .send({
          token: { refreshToken: refreshToken }
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