"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XSS = require("xss");
const Boom = require("boom");
class SecurityMiddleware {
    constructor() { }
    /**
     * @private static - XSS filter nested properties in request
     *
     * @param content
     */
    static filterXSS(content) {
        for (let key in content) {
            if (typeof content[key] == "object")
                SecurityMiddleware.filterXSS(content[key]);
            else if (typeof content[key] == "string")
                content[key] = XSS.filterXSS(content[key]);
        }
    }
}
/**
 * Sanitize data before using|insertion
 * @inheritdoc https://www.npmjs.com/package/xss
 *
 * @param req Request object
 * @param res Response object
 * @param next Function
 */
SecurityMiddleware.sanitize = (req, res, next) => {
    try {
        SecurityMiddleware.filterXSS(req.body);
        next();
    }
    catch (e) {
        next(Boom.expectationFailed(e.message));
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
;
