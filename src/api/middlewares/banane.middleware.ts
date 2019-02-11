import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { BananeSerializer } from "./../serializers/banane.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Banane middleware
 */
export class BananeMiddleware extends BaseMiddleware {

  constructor() { super( new BananeSerializer() ); }

}