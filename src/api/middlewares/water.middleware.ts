import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { WaterSerializer } from "./../serializers/water.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Water middleware
 */
export class WaterMiddleware extends BaseMiddleware {

  constructor() { super( new WaterSerializer() ); }

}
