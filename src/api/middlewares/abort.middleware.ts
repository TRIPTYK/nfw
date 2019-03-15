import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { AbortSerializer } from "./../serializers/abort.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Abort middleware
 */
export class AbortMiddleware extends BaseMiddleware {

  constructor() { super( new AbortSerializer() ); }

}
