"use strict";
exports.__esModule = true;
var Boom = require("boom");
var SecurityMiddleware = /** @class */ (function () {
    function SecurityMiddleware() {
    }
    /**
     * Sanitize data before using|insertion
     * FIXME fix embeded objects/arrays
     * @inheritdoc https://www.npmjs.com/package/xss
     *
     * @param req Request
     * @param res Response
     * @param next Function
     */
    SecurityMiddleware.sanitize = function (req, res, next) {
        try {
            for (var key in req.body) {
                //req.body[key] = XSS(req.body[key]);
            }
            next();
        }
        catch (e) {
            next(Boom.expectationFailed(e.message));
        }
    };
    return SecurityMiddleware;
}());
exports.SecurityMiddleware = SecurityMiddleware;
;
