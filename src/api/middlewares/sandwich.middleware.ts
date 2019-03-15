import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { SandwichSerializer } from "./../serializers/sandwich.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Sandwich middleware
 */
export class SandwichMiddleware extends BaseMiddleware {

  constructor() { super( new SandwichSerializer() ); }

}
