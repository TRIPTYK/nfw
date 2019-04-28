import * as request from "supertest";
import * as chai from "chai";
import * as fixtures from "./fixtures";

describe("Document CRUD", function () {

    let server, agent, token, id, password;
    const expect = chai.expect;

  before(function (done) {

      let express = require('../src/app.bootstrap');
    password    = fixtures.password();
    let credentials = { data : { attributes : fixtures.user('admin', password) } };

    server = express.App;
    agent = request.agent(server);

    agent
      .post('/api/v1/auth/register')
      .send(credentials)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        token = res.body.token.accessToken;
        id = res.body.user.data.id;
        done();
      });

  });

  after(function () {
    server = undefined;
  });

  it('POST succeed as 201 on /api/v1/documents (file upload)', function (done) {
    agent
      .post('/api/v1/documents')
      .attach('document', 'test/fixtures/documents/img.png')
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        id = res.body.data.id;
        done();
      })
  });

  it('POST failed with wrong file format', function (done) {
    agent
      .post('/api/v1/documents')
      .attach('document', 'test/fixtures/documents/text.txt')
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(415);
        done();
      })
  });

  it('GET succeed as 200 on /api/v1/documents/n', function (done) {
    agent
      .get('/api/v1/documents/' + id)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('GET succeed as 200 on /api/v1/documents', function (done) {
    agent
      .get('/api/v1/documents/' + id)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('PUT succeed as 200 on /api/v1/documents/n', function (done) {
    agent
      .put('/api/v1/documents/' + id)
      .set('Accept', 'application/vnd.api+json')
      .set('Authorization', 'Bearer ' + token)
      .attach('document', 'test/fixtures/documents/img_2.png')
      .expect(200, done);
  });

  it('DELETE succeed as 204 on /api/v1/documents/n', function (done) {
    agent
      .delete('/api/v1/documents/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });
});
