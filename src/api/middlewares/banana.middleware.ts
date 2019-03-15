import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { BananaSerializer } from "./../serializers/banana.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Banana middleware
 */
export class BananaMiddleware extends BaseMiddleware {

  constructor() { super( new BananaSerializer() ); }

}
