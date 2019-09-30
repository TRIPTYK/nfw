import {Request, Response, Router} from "express";
import {router as AuthRouter} from "./auth.route";
import {router as UserRouter} from "./user.route";
import {router as DocumentRouter} from "./document.route";
import {router as MonitoringRouter} from "./monitoring.route";

export const router = Router();

router.get('/status', (req: Request, res: Response) => {
    res.sendStatus(200);
});

/**
 * Authentification routes
 */
router.use('/auth/', AuthRouter);

/**
 * Users routes
 */
router.use('/users/', UserRouter);

/**
 * Files routes
 */
router.use('/documents/', DocumentRouter);

/**
 * Monitoring routes
 */
router.use('/monitoring', MonitoringRouter);