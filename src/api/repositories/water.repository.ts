import * as Boom from "boom";

import { Water } from "../models/water.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Water)
export class WaterRepository extends BaseRepository< Water >  {
  constructor() { super(); }
}
