import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { KickerSerializer } from "./../serializers/kicker.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Kicker middleware
 */
export class KickerMiddleware extends BaseMiddleware {

  constructor() { super( new KickerSerializer() ); }

}
