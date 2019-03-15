import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PlzSerializer } from "./../serializers/plz.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Plz middleware
 */
export class PlzMiddleware extends BaseMiddleware {

  constructor() { super( new PlzSerializer() ); }

}
