<<<<<<< HEAD
//import * as validate from "express-validation";

import { Router } from "express";
import { MonitoringController} from "../../controllers/monitoring.controller";
const router = Router();

const monitoringController = new MonitoringController();

router
  .route('/')
  /**
   * 
   */
  .get(monitoringController.get)
=======
import * as validate from "express-validation";

import { Router } from "express";
import { MonitoringController } from "./../../controllers/monitoring.controller";

const router = Router();
const monitoringController = new MonitoringController(); // Todo injecter comme dépendance


router
  .route('/')

  .get( monitoringController.get)
>>>>>>> 5a6a04bb75f5cacbe7849473ab944f6f56882d64

export { router };