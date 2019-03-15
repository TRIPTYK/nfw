import * as Boom from "boom";

import { Kicker } from "../models/kicker.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Kicker)
export class KickerRepository extends BaseRepository< Kicker >  {
  constructor() { super(); }
}
