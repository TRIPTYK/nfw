var request = require('supertest');
var fixtures = require('./fixtures');
var chai = require("chai");

chai.config.includeStack = false;
chai.config.truncateThreshold = true;

describe("Banane CRUD", function () {
  
  var server, agent, password, credentials, token, refreshToken, id;
  var expect = chai.expect;

  before(function (done) {

    let express = require('./../dist/app.bootstrap');
  
    server      = express.App;
    agent       = request.agent(server);
    password    = fixtures.password();
    credentials = { data : { attributes : fixtures.banane('admin', password) } };

    agent
      .post('/api/v1/auth/register')
      .send(credentials)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        token = res.body.token.accessToken;
        refreshToken = res.body.token.refreshToken;
        id = res.body.banane.data.id;
        done();
      });

  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  it('POST /api/v1/bananes succeed with 201', function (done) {
    agent
      .post('/api/v1/bananes')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({ data : { attributes : fixtures.banane('admin') } })
      .end(function(err, res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(201);
        done();
      }) 
  });

  it('GET /api/v1/bananes/profile succeed with 200', function (done) {
    agent
      .get('/api/v1/bananes/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('GET /api/v1/bananes/n succeed with 200', function (done) {
    agent
      .get('/api/v1/bananes/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('PUT /api/v1/bananes/n succeed with 200', function (done) {
    agent
      .put('/api/v1/bananes/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send( { data : { attributes : fixtures.user('banane') } })
      .expect(200, done);
  });

  it('PATCH /api/v1/bananes/n succeed with 200', function (done) {
    agent
      .patch('/api/v1/bananes/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data: {
          attributes : {}
        }
      })
      .expect(200, done);
  });

  it('DELETE /api/v1/bananes/n succeed with 204', function (done) {
    agent
      .delete('/api/v1/bananes/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });
});