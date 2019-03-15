import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DateSerializer } from "./../serializers/date.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Date middleware
 */
export class DateMiddleware extends BaseMiddleware {

  constructor() { super( new DateSerializer() ); }

}
