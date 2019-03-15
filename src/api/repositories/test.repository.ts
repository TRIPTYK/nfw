import * as Boom from "boom";

import { Test } from "../models/test.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Test)
export class TestRepository extends BaseRepository< Test >  {
  constructor() { super(); }
}
