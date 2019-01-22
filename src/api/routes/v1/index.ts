import * as Express from "express";
import { router as AuthRouter } from "./auth.route";
import { router as UserRouter } from "./user.route";
import { Request, Response } from "express";

const router = Express.Router();

router.get('/status', (req : Request, res : Response) => { res.sendStatus(200); })
router.use('/auth/', AuthRouter);
router.use('/users/', UserRouter);

module.exports = router;