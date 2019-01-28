var request = require('supertest');
var uuid = require('uuid/v4');

describe("Route's accessibility", function () {
  
  var server;
  
  before(function () {
    let express = require('./../dist/app.bootstrap')
    server = express.App;
  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  it('API status is OK 200', function (done) {
    request(server)
      .get('/api/v1/status')
      .expect(200, done);
  });

  describe("Authentification", function() {

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

  /**
  describe("Register", function() {

    it('Registering succeed with required fields email, password, services & role', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send({
          username: uuid().substr(0,32),
          email: uuid() + '@triptyk.be',
          password: 'e2q2mak7',
          services: "{}",
          role: "admin"
        })
        .expect(201, done);
    });

    it('Registering failed because email already exists', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .send({
          username: 'triptyk',
          email: 'steve@triptyk.be',
          password: 'e2q2mak7',
          services: "{}"
        })
        .expect(417, done);
    });

  });
  */

  describe("Unauthorized route's without token", function() {

    describe("User's routes", function() {

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

    describe("Document's routes", function() {

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

  describe("Route's empty payload validation", function() {

    it('Rejection as 400 on POST /api/v1/auth/register', function (done) {
      request(server)
        .post('/api/v1/auth/register')
        .expect(400, done);
    });

    it('Rejection as 400 on POST /api/v1/auth/login', function (done) {
      request(server)
        .post('/api/v1/auth/login')
        .expect(400, done);
    });

    it('Rejection as 400 on POST /api/v1/auth/refresh-token', function (done) {
      request(server)
        .post('/api/v1/auth/refresh-token')
        .expect(400, done);
    });

    it('Rejection as 400 on POST /api/v1/auth/facebook', function (done) {
      request(server)
        .post('/api/v1/auth/facebook')
        .expect(400, done);
    });

    it('Rejection as 400 on POST /api/v1/auth/google', function (done) {
      request(server)
        .post('/api/v1/auth/google')
        .expect(400, done);
    });

  });

  describe("Pages not found", function() {
    it('404 everything else', function (done) {
      request(server)
        .get('/api/v1/foo/bar')
        .expect(404, done);
    });
  });

  
});