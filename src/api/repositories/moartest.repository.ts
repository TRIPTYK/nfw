import * as Boom from "boom";

import { Moartest } from "../models/moartest.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Moartest)
export class MoartestRepository extends BaseRepository< Moartest >  {
  constructor() { super(); }
}
