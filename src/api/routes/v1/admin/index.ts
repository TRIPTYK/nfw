import {Router} from "express";
import {authorize} from "../../../middlewares/auth.middleware";
import {roles} from "../../../enums/role.enum";

const router = Router();

router.use(authorize([roles.admin]));

export {router};