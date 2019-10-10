// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require modules to test
const pkgInfo = require('./../package.json');

// Require the dev-dependencies
import * as request from "supertest";
import {expect} from "chai";

before(function (done) {
    import('./../src/app.bootstrap').then((srv) => {
        global['server'] = srv;
        done();
    });
});

describe("Express application", function () {
    it("Express instance type is function", function () {
        expect(typeof (global['server'])).to.equal('function');
    });

    it("Express server version is 4.16.4", function () {
        expect(pkgInfo.dependencies.express.slice(1)).to.equal('4.16.4');
    });

    it('API status is OK 200', function (done) {
        request(global['server'])
            .get('/api/v1/status')
            .expect(200, done);
    });
});

after(function(done) {
    request(global['server'])
        .delete('/api/v1/users/' + global['login']['id'])
        .set('Authorization', 'Bearer ' + global['login'].token)
        .end((err,response) => {
            delete global['server'];
            expect(response.status).to.equal(204);
            console.log("TEST FINISHED AND CLEARED");
            done();
        });
});