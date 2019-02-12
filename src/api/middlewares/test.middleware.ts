import * as Boom from "boom";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { TestSerializer } from "./../serializers/test.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * Test middleware
 */
export class TestMiddleware extends BaseMiddleware {

  constructor() { super( new TestSerializer() ); }

}