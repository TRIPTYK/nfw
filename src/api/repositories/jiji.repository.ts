import * as Boom from "boom";

import { Jiji } from "../models/jiji.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Jiji)
export class JijiRepository extends BaseRepository< Jiji >  {
  constructor() { super(); }
}
