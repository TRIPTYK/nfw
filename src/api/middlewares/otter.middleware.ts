import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { OtterSerializer } from "./../serializers/otter.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Otter middleware
 */
export class OtterMiddleware extends BaseMiddleware {

  constructor() { super( new OtterSerializer() ); }

}