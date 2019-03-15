import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { JijiSerializer } from "./../serializers/jiji.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Jiji middleware
 */
export class JijiMiddleware extends BaseMiddleware {

  constructor() { super( new JijiSerializer() ); }

}
