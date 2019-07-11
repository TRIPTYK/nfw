import {Router} from "express";
import {ADMIN, authorize} from "../../../middlewares/auth.middleware";

const router = Router();

router.use(authorize([ADMIN]));

export {router};