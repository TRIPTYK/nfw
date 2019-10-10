import * as chai from "chai";
import * as request from "supertest";
import * as fixtures from "./fixtures";
import {expect} from "chai";

chai.config.includeStack = false;
chai.config.truncateThreshold = 1;

describe("User CRUD", function () {
  let agent, token, id;

  before(function (done) {
    agent = request.agent(global['server']);
    token = global['login'].token;
    done();
  });

  it('POST /api/v1/users succeed with 201', function (done) {
    agent
      .post('/api/v1/users')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({ data : { attributes : fixtures.user('admin') } })
      .end(function(err, res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(201);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username',
          'email',
          'firstname',
          'lastname',
          'role',
          'created-at',
          'updated-at'
        );
        id = res.body.data.id;
        done();
      })
  });

  it('GET /api/v1/users/profile succeed with 200', function (done) {
    agent
      .get('/api/v1/users/profile')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(200);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username',
          'email',
          'firstname',
          'lastname',
          'role',
          'created-at',
          'updated-at'
        );
        done();
      })
  });

  it('GET /api/v1/users/n succeed with 200', function (done) {
    agent
      .get('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username',
            'email',
            'updated-at',
            'firstname',
            'lastname',
            'role',
            'created-at'
        );
        done();
      });
  });

  it('GET Json-api fields' , function(done) {
    agent
      .get(`/api/v1/users/${id}?fields=username`)
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username'
        );
        done();
      });
  });

  it('PUT /api/v1/users/n succeed with 200', function (done) {
    agent
      .put('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send( { data : { attributes : fixtures.user('user') } })
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username',
          'email',
           'updated-at',
          //'documents',
          'firstname',
          'lastname',
          'role',
          'created-at'
        );
        done()
      });
  });

  it('PATCH /api/v1/users/n succeed with 200', function (done) {
    agent
      .patch('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data: {
          attributes : {
            username: fixtures.user().username,
            lastname: fixtures.user().lastname
          }
        }
      })
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.type).to.equal('user');
        expect(res.body.data.id).to.be.a('string');
        expect(res.body.data.attributes).to.include.all.keys(
          'username',
          'email',
          'firstname',
          'lastname',
          'role',
          'created-at',
          'updated-at'
        );
        done()
      });
  });

  it('DELETE /api/v1/users/n succeed with 204', function (done) {
    agent
      .delete('/api/v1/users/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });
});
