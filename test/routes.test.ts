import * as request from "supertest";

describe("Route's accessibility", function() {
  describe("Pages not found", function() {
    it("404 everything else", function(done) {
      request(global["server"])
        .get("/api/v1/foo/bar")
        .expect(404, done);
    });
  });
});
