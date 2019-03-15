import * as Boom from "boom";

import { Banana } from "../models/banana.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Banana)
export class BananaRepository extends BaseRepository< Banana >  {
  constructor() { super(); }
}
