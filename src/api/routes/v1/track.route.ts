import * as validate from "express-validation";

import { Router } from "express";
import { TrackController } from "./../../controllers/track.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import * as Validation from "./../../validations/track.validation";
import { SecurityMiddleware } from "./../../middlewares/security.middleware";
import { TrackMiddleware } from "./../../middlewares/track.middleware";

const router = Router();

const trackController = new TrackController();
const trackMiddleware = new TrackMiddleware();

router
  .route('/')

  /**
   * @api {get} v1/tracks List Tracks
   * @apiDescription Get a list of tracks
   * @apiVersion 1.0.0
   * @apiName ListTracks
   * @apiGroup Track
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  Track's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Tracks per page
   * @apiParam  {String=track,admin}  [role]       Track's role
   *
   * @apiSuccess {Object[]} tracks List of tracks.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated tracks can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(/*authorize([ADMIN]),*/ validate(Validation.listTracks), trackController.list)



  /**
   * @api {post} v1/tracks Create Track
   * @apiDescription Create a new track
   * @apiVersion 1.0.0
   * @apiName CreateTrack
   * @apiGroup Track
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Track's access token
   *
   *
   * @apiSuccess (Created 201) {String}  track.id         Track's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated tracks can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(/*authorize([ADMIN]),*/ validate(Validation.createTrack), SecurityMiddleware.sanitize, trackController.create);


router
  .route('/:id')

  /**
   * @api {get} v1/tracks/:id Get Track
   * @apiDescription Get track information
   * @apiVersion 1.0.0
   * @apiName GetTrack
   * @apiGroup Track
   * @apiPermission track
   *
   * @apiHeader {String} Athorization  Track's access token
   *
   * @apiSuccess {String}  id         Track's id
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tracks can access the data
   * @apiError (Forbidden 403)    Forbidden    Only track with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Track does not exist
   */
  .get(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.getTrack), trackController.get)



  /**
   * @api {put} v1/tracks/:id Replace Track
   * @apiDescription Replace the whole track document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceTrack
   * @apiGroup Track
   * @apiPermission track
   *
   * @apiHeader {String} Athorization  Track's access token
   *
   * @apiParam  {String=track,admin}  [role]    Track's role
   * (You must be an admin to change the track's role)
   *
   * @apiSuccess {String}  id         Track's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tracks can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only track with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Track does not exist
   */
  .put(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.replaceTrack), SecurityMiddleware.sanitize, trackController.update)



  /**
   * @api {patch} v1/tracks/:id Update Track
   * @apiDescription Update some fields of a track document
   * @apiVersion 1.0.0
   * @apiName UpdateTrack
   * @apiGroup Track
   * @apiPermission track
   *
   * @apiHeader {String} Authorization  Track's access token
   *
   * @apiParam  {String=track,admin}  [role]    Track's role
   * (You must be an admin to change the track's role)
   *
   * @apiSuccess {String}  id         Track's id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated tracks can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only track with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Track does not exist
   */
  .patch(/*authorize([ADMIN, LOGGED_USER]),*/ validate(Validation.updateTrack), SecurityMiddleware.sanitize, trackController.update)



  /**
   * @api {patch} v1/tracks/:id Delete Track
   * @apiDescription Delete a track
   * @apiVersion 1.0.0
   * @apiName DeleteTrack
   * @apiGroup Track
   * @apiPermission track
   *
   * @apiHeader {String} Athorization  Track's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated tracks can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only track with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Track does not exist
   */
  .delete(/*authorize([ADMIN, LOGGED_USER]),*/ SecurityMiddleware.sanitize, trackController.remove);


export { router };
