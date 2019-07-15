// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require modules to test
var pkgInfo = require('./../package.json');

// Require the dev-dependencies

import {expect} from "chai";
import * as request from "supertest";

describe("Express application", function () {

    let server;

    before(function () {
        let express = require('./../src/app.bootstrap')
        server = express.App;
    });

    after(function () {
        server = undefined;
    });

    it("Express instance type is function", function () {
        expect(typeof (server)).to.equal('function');
    });

    it("Express server version is 4.16.4", function () {
        expect(pkgInfo.dependencies.express.slice(1)).to.equal('4.16.4');
    });

    it('API status is OK 200', function (done) {
        request(server)
            .get('/api/v1/status')
            .expect(200, done);
    });
});