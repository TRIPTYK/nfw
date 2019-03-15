import * as Boom from "boom";

import { Plz } from "../models/plz.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Plz)
export class PlzRepository extends BaseRepository< Plz >  {
  constructor() { super(); }
}
