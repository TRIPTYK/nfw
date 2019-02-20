"use strict";
exports.__esModule = true;
var express_1 = require("express");
var auth_route_1 = require("./auth.route");
var user_route_1 = require("./user.route");
var document_route_1 = require("./document.route");
var router = express_1.Router();
exports.router = router;
/**
 * @api {get} v1/status
 * @apiDescription Ping API
 * @apiVersion 1.0.0
 * @apiName Status
 * @apiPermission public
 *
 * @apiSuccess (Success 200) {String}  token.tokenType OK string success
 *
 * @Error (Internal server error)
 */
router.get('/status', function (req, res) { res.sendStatus(200); });
/**
 * Authentification routes
 */
router.use('/auth/', auth_route_1.router);
/**
 * Users routes
 */
router.use('/users/', user_route_1.router);
/**
 * Files routes
 */
router.use('/documents/', document_route_1.router);
