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

  describe("Pages not found", function() {
    it('404 everything else', function (done) {
      request(server)
        .get('/api/v1/foo/bar')
        .expect(404, done);
    });
  });

  
});