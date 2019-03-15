import * as Boom from "boom";

import { Sandwich } from "../models/sandwich.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Sandwich)
export class SandwichRepository extends BaseRepository< Sandwich >  {
  constructor() { super(); }
}
