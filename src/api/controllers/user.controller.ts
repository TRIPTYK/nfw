import * as HttpStatus from "http-status";

import * as Boom from "boom"
import { Request, Response } from "express";
import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";
import { getRepository, getCustomRepository } from "typeorm";
import * as Pluralize from "pluralize";
import { BaseController } from "./base.controller";
import { UserSerializer } from "../serializers/user.serializer";
import { relations as userRelations } from "../enums/relations/user.relations";
import { relations as documentRelations } from "../enums/relations/document.relations";
import { DocumentRepository } from "../repositories/document.repository";
import { Serializer as JSONAPISerializer } from "jsonapi-serializer";
import { api, env , port, url } from "../../config/environment.config";
import { fullLog } from "../utils/log.util";
import { BaseSerializer } from "../serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";


/**
 *
 */
export class UserController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Get serialized user
   *
   * @param req Request object
   * @param res Response object
   *
   */
  public get(req: Request, res : Response) { res.json( req['locals'].whitelist() ); }

  /**
   * Get logged in user info
   *
   * @param req Request object
   * @param res Response object
   *
   */
  public loggedIn (req: Request, res : Response) { res.json( req['user'].whitelist() ); }

  /**
   * Create new user
   *
   * @param req Request object
   * @param res Response object
   * @param next Next middleware function
   *
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(User);
      const user = new User(req.body);
      const savedUser = await repository.save(user);
      res.status( HttpStatus.CREATED );
      res.json( new UserSerializer().serialize(savedUser) );
    }
    catch (e) { next( User.checkDuplicateEmail(e) ); }
  }

  /**
   * public async - fetch relationships id
   *
   * @param  req: Request
   * @param  res : Response
   * @param  next: Function
   */
   public async relationships (req: Request, res : Response, next: Function) {
     try {
       const docRepository = getCustomRepository(UserRepository);
       const tableName = docRepository.metadata.tableName;
       let { userId , relation } = req.params;
       const serializer = new JSONAPISerializer(relation,{
         topLevelLinks : {
           self : () =>  `${url}/${tableName}s${req.url}`,
           related : () => `${url}/${tableName}s/${userId}/${Pluralize.plural(relation)}`
         }
       });

       const exists = docRepository.metadata.relations.find(e => [Pluralize.plural(relation),Pluralize.singular(relation)].includes(e.propertyName));

       if (!exists) throw Boom.notFound();

       if (['many-to-one','one-to-one'].includes(exists.relationType))
        relation = Pluralize.singular(relation);

       const user = await docRepository.createQueryBuilder(docRepository.metadata.tableName)
         .leftJoinAndSelect(`${tableName}.${relation}`,relation)
         .select([`${relation}.id`,`${tableName}.id`]) // select minimal informations
         .where({id : userId})
         .getOne();

       if (!user) throw Boom.notFound();

       res.json( serializer.serialize(user[relation]) );
     }
     catch(e) { next(e); }
   }


   /**
    * Fetch related resources
    *
    * @param req Request object
    * @param res Response object
    * @param next Next middleware function
    *
    * TODO : allow add json-api includes
    */
   public async related(req: Request, res : Response, next: Function)
   {
     try {
       const docRepository = getCustomRepository(UserRepository);
       const tableName = docRepository.metadata.tableName;
       let { userId , relation } = req.params;

       if (!userRelations.includes(relation)) throw Boom.notFound();

       let serializerImport = await import(`../serializers/${Pluralize.singular(relation)}.serializer`);

       serializerImport = serializerImport[Object.keys(serializerImport)[0]];

       const serializer = new JSONAPISerializer(relation,{
         attributes : serializerImport.withelist,
         topLevelLinks : {
           self : () =>  `${url}/${tableName}s${req.url}`
         }
       });

       const exists = docRepository.metadata.relations.find(e => [Pluralize.plural(relation),Pluralize.singular(relation)].includes(e.propertyName));

       if (!exists) throw Boom.notFound();

       if (['many-to-one','one-to-one'].includes(exists.relationType))
        relation = Pluralize.singular(relation);

       const user = await docRepository.createQueryBuilder(tableName)
         .leftJoinAndSelect(`${tableName}.${relation}`,relation)
         .where({id : userId})
         .getOne();

       if (!user) throw Boom.notFound();

       res.json( serializer.serialize(user[relation]) );
     }
     catch(e) { next(e); }
   }

  /**
   * Update existing user
   *
   * @param req Request
   * @param res Response
   * @param next Next middleware function
   *
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(User);
      const user = await repository.findOne(req.params.userId, { relations : ["documents"] });

      if(req.body.password === null || req.body.password === ''){
        req.body.password = undefined;
      }

      if(req.body.documents) user.documents = await getCustomRepository(DocumentRepository).findByIds(req.body.documents);

      repository.merge(user, req.body);
      const saved = await repository.save(user);

      res.json( new UserSerializer().serialize(saved) );
    }
    catch(e) { next( User.checkDuplicateEmail(e) ); }

  };

  /**
   * Get user list
   *
   * @param req Request
   * @param res Response
   * @param next Next middleware function
   *
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(UserRepository);
      const [users,totalUsers] = await repository.jsonApiRequest(req.query,userRelations).getManyAndCount();

      res.json(  new UserSerializer(req,totalUsers).serialize(users) );
    }
    catch (e) { next(e); }
  }

  /**
   * Delete user
   *
   * @param req Request
   * @param res Response
   * @param next Next middleware function
   *
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const user = req['locals'];
      const repository = getRepository(User);
      await repository.remove(user);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { console.log(e.message); next(e); }

  }
}
