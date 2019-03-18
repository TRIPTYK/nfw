import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { TrackSerializer } from "./../serializers/track.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Track middleware
 */
export class TrackMiddleware extends BaseMiddleware {

  constructor() { super( new TrackSerializer() ); }

}
