import * as request from "supertest";

describe("Route's accessibility", function () {
  
  var server;
  
  before(function () {
    let express = require('./../src/app.bootstrap')
    server = express.App;
  });
  
  after(function () {
    server = undefined;
  });

  describe("Pages not found", function() {
    it('404 everything else', function (done) {
      request(server)
        .get('/api/v1/foo/bar')
        .expect(404, done);
    });
  });
});