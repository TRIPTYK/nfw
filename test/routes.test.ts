import * as request from "supertest";

describe("Route's accessibility", function () {
  let server;
  
  before(function (done) {
    import('../src/app.bootstrap').then((srv) => {
        server = srv;
        done();
    });
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