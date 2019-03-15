import * as Boom from "boom";

import { Banane } from "../models/banane.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Banane)
export class BananeRepository extends BaseRepository< Banane >  {
  constructor() { super(); }
}
