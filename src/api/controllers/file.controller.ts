import * as HttpStatus from "http-status";

import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";
import { Request, Response } from "express";
import { getConnection, Connection, getRepository, getCustomRepository } from "typeorm";
import { typeorm as TypeORM } from "./../../config/environment.config";

/**
 * 
 */
class FileController {

  /** */
  connection : Connection ;

  /** */
  constructor() { this.connection = getConnection(TypeORM.name); }

  
  // CRUD + upload
};

export { FileController };