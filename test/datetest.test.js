var request = require('supertest');
var fixtures = require('./fixtures');
var chai = require("chai");

chai.config.includeStack = false;
chai.config.truncateThreshold = true;

describe("Datetest CRUD", function () {

  var server, agent, password, credentials, token, id;
  var expect = chai.expect;

  before(function (done) {

    let express = require('./../dist/app.bootstrap');

    server      = express.App;
    agent       = request.agent(server);
    password    = fixtures.password();
    credentials = { data : { attributes : fixtures.user('admin', password) } };

    agent
      .post('/api/v1/auth/register')
      .send(credentials)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        token = res.body.token.accessToken;
        done();
      });

  });

  after(function () {
    server = undefined;
    delete server;
  });


  /**
   * POST a datetest object to the API
   */
  it('POST /api/v1/datetests succeed with 201', function (done) {
    agent
      .post('/api/v1/datetests')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data : {
          attributes : { 
              datetest : fixtures.randomdatetime(),            
          }
        }
      })
      .end(function(err, res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(201);
        expect(res.body.data.attributes).to.include.all.keys(
          'datetest'
        );
        id = res.body.data.id;
        done();
      })
  });



  /**
   * GET a datetest object from the API
   */
  it('GET /api/v1/datetests/n succeed with 200', function (done) {
    agent
      .get('/api/v1/datetests/' + id)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err,res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(200);
        expect(res.body.data.attributes).to.include.all.keys(
          'datetest'
        );
        done();
      })
  });



  /**
   * PUT a datetest object to the API
   */
  it('PUT /api/v1/datetests/n succeed with 200', function (done) {
    agent
      .put('/api/v1/datetests/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data : {
          attributes : { 
              datetest : fixtures.randomdatetime(),            
          }
        }
      })
      .end(function (err,res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(200);
        expect(res.body.data.attributes).to.include.all.keys(
          'datetest'
        );
        done();
      })
  });



  /**
   * PATCH a datetest object to the API
   */
  it('PATCH /api/v1/datetests/n succeed with 200', function (done) {
    agent
      .patch('/api/v1/datetests/' + id)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/vnd.api+json')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data : {
          attributes : { 
              datetest : fixtures.randomdatetime(),            
          }
        }
      })
      .end(function (err,res) {
        let status = res.status | res.statusCode;
        expect(status).to.equal(200);
        expect(res.body.data.attributes).to.include.all.keys(
          'datetest'
        );
        done();
      })
  });



  /**
   * DELETE a datetest object from the API
   */
  it('DELETE /api/v1/datetests/n succeed with 204', function (done) {
    agent
      .delete('/api/v1/datetests/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });

});
