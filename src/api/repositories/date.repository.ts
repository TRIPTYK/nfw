import * as Boom from "boom";

import { Date } from "../models/date.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Date)
export class DateRepository extends BaseRepository< Date >  {
  constructor() { super(); }
}
