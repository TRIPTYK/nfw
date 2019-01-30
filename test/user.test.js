var request = require('supertest');
var uuid = require('uuid/v4');
var fixtures = require('./fixtures');

describe("User CRUD", function () {
  
  var server, agent, password, credentials, token, refreshToken, uid, id;
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
      .end(function(err, response) {
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

  it('POST /api/v1/users succeed with 201', function (done) {
    agent
      .post('/api/v1/users')
      .set('Authorization', 'Bearer ' + token)
      .send(fixtures.user('admin'))
      .end(function(err, res) {
        expect(res.statusCode, 201);
        id = res.body.id;
        done();
      }) 
  });

  it('GET /api/v1/users/profile succeed with 200', function (done) {
    agent
      .get('/api/v1/users/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('GET /api/v1/users/n succeed with 200', function (done) {
    agent
      .get('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('PUT /api/v1/users/n succeed with 200', function (done) {
    agent
      .put('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .send(fixtures.user('user'))
      .expect(200, done);
  });

  it('PATCH /api/v1/users/n succeed with 200', function (done) {
    agent
      .patch('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: fixtures.user().username,
        lastname: fixtures.user().lastname
      })
      .expect(200, done);
  });

  it('DELETE /api/v1/users/n succeed with 204', function (done) {
    agent
      .delete('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });
});