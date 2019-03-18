import { Router } from "express";
import { router as TrackRouter } from "./track.route";
import { router as BananeRouter } from "./banane.route";
import { router as AbortRouter } from "./abort.route";
import { router as BananaRouter } from "./banana.route";
import { router as ChocolatRouter } from "./chocolat.route";
import { router as Colde_oneRouter } from "./colde_one.route";
import { router as DateRouter } from "./date.route";
import { router as DatetestRouter } from "./datetest.route";

import { Request, Response } from "express";
import { router as AuthRouter } from "./auth.route";
import { router as UserRouter } from "./user.route";
import { router as DocumentRouter } from "./document.route";


const router = Router();

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
router.get('/status', (req : Request, res : Response) => { res.sendStatus(200); });

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
 *Track routes
 */
router.use('/tracks/', TrackRouter);


/**
 *Banane routes
 */
router.use('/bananes/', BananeRouter);


/**
 *Abort routes
 */
router.use('/aborts/', AbortRouter);


/**
 *Banana routes
 */
router.use('/bananas/', BananaRouter);


/**
 *Chocolat routes
 */
router.use('/chocolats/', ChocolatRouter);


/**
 *Colde_one routes
 */
router.use('/colde_ones/', Colde_oneRouter);


/**
 *Date routes
 */
router.use('/dates/', DateRouter);


/**
 *Datetest routes
 */
router.use('/datetests/', DatetestRouter);


export { router }









