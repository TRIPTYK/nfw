import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { MoartestSerializer } from "./../serializers/moartest.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Moartest middleware
 */
export class MoartestMiddleware extends BaseMiddleware {

  constructor() { super( new MoartestSerializer() ); }

}
