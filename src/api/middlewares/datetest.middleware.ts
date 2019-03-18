import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DatetestSerializer } from "./../serializers/datetest.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Datetest middleware
 */
export class DatetestMiddleware extends BaseMiddleware {

  constructor() { super( new DatetestSerializer() ); }

}
