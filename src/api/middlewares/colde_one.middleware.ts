import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Colde_oneSerializer } from "./../serializers/colde_one.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Colde_one middleware
 */
export class Colde_oneMiddleware extends BaseMiddleware {

  constructor() { super( new Colde_oneSerializer() ); }

}
