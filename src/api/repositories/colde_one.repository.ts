import * as Boom from "boom";

import { Colde_one } from "../models/colde_one.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Colde_one)
export class Colde_oneRepository extends BaseRepository< Colde_one >  {
  constructor() { super(); }
}
