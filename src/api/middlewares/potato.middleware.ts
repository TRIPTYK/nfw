import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PotatoSerializer } from "./../serializers/potato.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Potato middleware
 */
export class PotatoMiddleware extends BaseMiddleware {

  constructor() { super( new PotatoSerializer() ); }

}
