import * as Boom from "boom";

import { Potato } from "../models/potato.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Potato)
export class PotatoRepository extends BaseRepository< Potato >  {
  constructor() { super(); }
}
