import * as Boom from "boom";

import { Chocolat } from "../models/chocolat.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Chocolat)
export class ChocolatRepository extends BaseRepository< Chocolat >  {
  constructor() { super(); }
}
