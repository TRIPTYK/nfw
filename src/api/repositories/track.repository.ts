import * as Boom from "boom";

import { Track } from "../models/track.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { BaseRepository } from "./base.repository";

@EntityRepository(Track)
export class TrackRepository extends BaseRepository< Track >  {
  constructor() { super(); }
}
