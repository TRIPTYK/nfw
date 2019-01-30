// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require modules to test
var pkgInfo = require('./../package.json');

// Require the dev-dependencies

const expect  = require("chai").expect;
const request = require('supertest');

describe("Express application", function () {
  
  var server;
  
  before(function () {
    let express = require('./../dist/app.bootstrap')
    server = express.App;
  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  it("Express instance type is function", function() {
    expect(typeof(server)).to.equal('function');
  });

  it("Express server version is 4.16.4", function() {
    expect(pkgInfo.dependencies.express.slice(1)).to.equal('4.16.4');
  });
  
  it('API status is OK 200', function (done) {
    request(server)
      .get('/api/v1/status')
      .expect(200, done);
  });

});