import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ChocolatSerializer } from "./../serializers/chocolat.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Chocolat middleware
 */
export class ChocolatMiddleware extends BaseMiddleware {

  constructor() { super( new ChocolatSerializer() ); }

}
