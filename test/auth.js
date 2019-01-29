var request = require('supertest');
var uuid = require('uuid/v4');

describe("Authentification", function () {
  
  var server;
  
  before(function () {
    let express = require('./../dist/app.bootstrap')
    server = express.App;
  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  describe("Login", function() {

    it('Authentification succeed with good credentials', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send({
          username: 'triptyk',
          email: 'steve@triptyk.eu',
          password: 'e2q2mak7'
        })
        .expect(200, done);
    });

    it('Authentification failed with bad password', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send({
          username: 'triptyk',
          email: 'steve@triptyk.eu',
          password: 'e2q2mak6'
        })
        .expect(417, done);
    });

    it('Authentification failed with bad email', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .send({
          username: 'triptyk',
          email: 'steve@triptyk.com',
          password: 'e2q2mak7'
        })
        .expect(417, done);
    });

  });

  describe("Register", function() {

    it('Registering succeed with required fields', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send({
          username: uuid().substr(0,32),
          email: uuid() + '@triptyk.be',
          password: 'e2q2mak7',
          services: "{}",
          role: "admin",
          firstname: uuid().substr(0,8),
          lastname: uuid().substr(0,8)
        })
        .expect(201, done);
    });

    it('Registering failed because email already exists', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send({
          username: uuid().substr(0,32),
          email: 'steve@triptyk.eu',
          password: 'e2q2mak7',
          services: "{}",
          role: "admin",
          firstname: uuid().substr(0,8),
          lastname: uuid().substr(0,8)
        })
        .expect(409, done);
    });

  });
  
  describe("Unauthorized without token", function() {

    describe("Users", function() {

      it('Rejection as 403 on GET /api/v1/users', function (done) {
        request(server)
          .get('/api/v1/users')
          .expect(403, done);
      });
  
      it('Rejection as 403 on GET /api/v1/users/1', function (done) {
        request(server)
          .get('/api/v1/users/1')
          .expect(403, done);
      });

      it('Rejection as 403 on GET /api/v1/users/profile', function (done) {
        request(server)
          .get('/api/v1/users/profile')
          .expect(403, done);
      });

      it('Rejection as 403 on POST /api/v1/users', function (done) {
        request(server)
          .post('/api/v1/users')
          .expect(403, done);
      });
  
      it('Rejection as 403 on PUT /api/v1/users/1', function (done) {
        request(server)
          .put('/api/v1/users/1')
          .expect(403, done);
      });
  
      it('Rejection as 403 on PATCH /api/v1/users/1', function (done) {
        request(server)
          .patch('/api/v1/users/1')
          .expect(403, done);
      });
  
      it('Rejection as 403 on DELETE /api/v1/users/1', function (done) {
        request(server)
          .delete('/api/v1/users/1')
          .expect(403, done);
      });

    });

    describe("Documents", function() {

      it('Rejection as 403 on GET /api/v1/documents', function (done) {
        request(server)
          .get('/api/v1/documents')
          .expect(403, done);
      });

      it('Rejection as 403 on POST /api/v1/documents', function (done) {
        request(server)
          .post('/api/v1/documents')
          .expect(403, done);
      });
  
      it('Rejection as 403 on PUT /api/v1/documents', function (done) {
        request(server)
          .put('/api/v1/documents/1')
          .expect(403, done);
      });
  
      it('Rejection as 403 on PATCH /api/v1/documents', function (done) {
        request(server)
          .patch('/api/v1/documents/1')
          .expect(403, done);
      });
  
      it('Rejection as 403 on DELETE /api/v1/documents', function (done) {
        request(server)
          .delete('/api/v1/documents/1')
          .expect(403, done);
      });

    });

  });

});