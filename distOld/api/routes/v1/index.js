"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const document_route_1 = require("./document.route");
const monitoring_route_1 = require("./monitoring.route");
const router = express_1.Router();
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
router.get('/status', (req, res) => { res.sendStatus(200); });
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
/**
 * Monitoring routes
 */
router.use('/monitoring', monitoring_route_1.router);
