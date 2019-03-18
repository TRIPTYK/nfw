import * as Boom from "boom";

import { Datetest } from "../models/datetest.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Datetest)
export class DatetestRepository extends BaseRepository< Datetest >  {
  constructor() { super(); }
}
