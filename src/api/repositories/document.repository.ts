import * as Boom from "boom";

import { Document } from "../models/document.model";
import { Repository, EntityRepository, getRepository  } from "typeorm";
import { omitBy, isNil } from "lodash";
import { BaseRepository } from "./base.repository";

@EntityRepository(Document)
export class DocumentRepository extends BaseRepository<Document>  {

  /** */
  constructor() { super(); }
}
