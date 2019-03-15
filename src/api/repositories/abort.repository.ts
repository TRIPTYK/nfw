import * as Boom from "boom";

import { Abort } from "../models/abort.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Abort)
export class AbortRepository extends BaseRepository< Abort >  {
  constructor() { super(); }
}
