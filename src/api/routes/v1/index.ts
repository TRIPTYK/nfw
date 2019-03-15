import { Router } from "express";
import { router as SandwichRouter } from "./sandwich.route";
import { router as BananaRouter } from "./banana.route";
import { router as PlzRouter } from "./plz.route";

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
 *Sandwich routes
 */
router.use('/sandwichs/', SandwichRouter);


/**
 *Banana routes
 */
router.use('/bananas/', BananaRouter);


/**
 *Plz routes
 */
router.use('/plzs/', PlzRouter);


export { router }









