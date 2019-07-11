import {Router} from "express";
import {MonitoringController} from "../../controllers/monitoring.controller";

const router = Router();
const monitoringController = new MonitoringController(); // Todo injecter comme dépendance


router
    .route('/').get(monitoringController.method('get'));

export {router};
