import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Test } from "./../models/test.model";
import { TestRepository } from "./../repositories/test.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";

/**
 * 
 */
export class TestController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Get serialized test
   * 
   * @param req Request
   * @param res Response
   * 
   * @public
   */
  public get(req: Request, res : Response) { 
    const repository = getRepository(Test);
    const test = repository.findOneOrFailed(req.params.testId);
    res.json( test.whitelist() ); 
  }

  /**
   * Create new test
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Test);
      const test = new Test(req.body);
      const savedTest = await repository.save(test);
      res.status( HttpStatus.CREATED );
      res.json( savedTest.whitelist() );
    } 
    catch (e) { next( e.message ); }
  }

  /**
   * Update existing test
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Test);
      const test = await repository.findOne(req.params.testId);
      repository.merge(test, req.body);
      repository.save(test);
      res.json( test.whitelist() );
    }
    catch(e) { next( e.message ); }
    
  };

  /**
   * Get test list
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(TestRepository);
      const tests = await repository.list(req.query);
      res.json(tests);
    } 
    catch (e) { next(e); }
  }

  /**
   * Delete test
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const testRepository = getRepository(Test);
      const test = await testRepository.findOne(req.params.testId);
      const repository = getRepository(Test);
      await repository.remove(test);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }
    
  }
}
