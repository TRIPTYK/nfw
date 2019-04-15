"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitoring_controller_1 = require("./../../controllers/monitoring.controller");
const router = express_1.Router();
exports.router = router;
const monitoringController = new monitoring_controller_1.MonitoringController(); // Todo injecter comme dépendance
router
    .route('/').get(monitoringController.get);
