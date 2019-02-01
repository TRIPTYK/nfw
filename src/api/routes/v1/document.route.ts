import * as validate from "express-validation";

import { Router } from "express";
import { DocumentController } from "./../../controllers/document.controller";
import { authorize, ADMIN, LOGGED_USER } from "./../../middlewares/auth.middleware";
import { listDocuments, getDocument, replaceDocument, updateDocument, deleteDocument } from "./../../validations/document.validation";
import { set as Multer } from "./../../../config/multer.config";
import { DocumentMiddleware } from "./../../middlewares/document.middleware";

const router = Router();
const upload = Multer();

const documentController = new DocumentController(); /* TODO injecter la dépendance via le router proxy */
const documentMiddleware = new DocumentMiddleware(); /* TODO injecter la dépendance via le router proxy */

/**
 * Deserialize document when API with userId route parameter is hit
 */
router.param('documentId', documentMiddleware.deserialize);

router
  .route('/')
  /**
   * @api {get} v1/documents List documents
   * @apiDescription Get a list of documents
   * @apiVersion 1.0.0
   * @apiName Listdocuments
   * @apiGroup Document
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Document's per page
   * @apiParam  {String}             [filename]   Document's filename
   * @apiParam  {String}             [path]       Document's path
   * @apiParam  {Number}             [size]       Document's size
   * @apiParam  {String}             [mimetype]   Document's mime type
   *
   * @apiSuccess {Object[]} documents List of documents.
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can access the data
   */
  .get(authorize([ADMIN]), validate(listDocuments), documentController.list)

  /**
   * @api {post} v1/documents Create File
   * @apiDescription Create a new file
   * @apiVersion 1.0.0
   * @apiName CreateDocument
   * @apiGroup Document
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {File} document Uploaded document
   *
   * @apiSuccess (Created 201) {String}  document.id         Document's id
   * @apiSuccess (Created 201) {String}  document.filename   Document's name
   * @apiSuccess (Created 201) {String}  document.path       Document's path
   * @apiSuccess (Created 201) {String}  document.mimetype   Document's mime type
   * @apiSuccess (Created 201) {String}  document.size       Document's size
   * @apiSuccess (Created 201) {Date}    document.createdAt  Date
   * @apiSuccess (Created 201) {Date}    document.updatedAt  Date
   * @apiSuccess (Created 201) {Date}    document.deletedAt  Date
   * 
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN, LOGGED_USER]), upload.single('document'), documentMiddleware.resize, documentController.create);

router
  .route('/:documentId')
  /**
   * @api {get} v1/documents/:id Get File
   * @apiDescription Get file information
   * @apiVersion 1.0.0
   * @apiName GetDocument
   * @apiGroup Document
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (Created 201) {String}  document.id         Document's id
   * @apiSuccess (Created 201) {String}  document.filename   Document's name
   * @apiSuccess (Created 201) {String}  document.path       Document's path
   * @apiSuccess (Created 201) {String}  document.mimetype   Document's mime type
   * @apiSuccess (Created 201) {String}  document.size       Document's size
   * @apiSuccess (Created 201) {Date}    document.createdAt  Date
   * @apiSuccess (Created 201) {Date}    document.updatedAt  Date
   * @apiSuccess (Created 201) {Date}    document.deletedAt  Date
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     File does not exist
   */
  .get(authorize([ADMIN, LOGGED_USER]), validate(getDocument), documentController.get)

  /**
   * @api {put} v1/documents/:id Replace File
   * @apiDescription Replace the whole file document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDocument
   * @apiGroup Document
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess (Created 201) {String}  document.id         Document's id
   * @apiSuccess (Created 201) {String}  document.filename   Document's name
   * @apiSuccess (Created 201) {String}  document.path       Document's path
   * @apiSuccess (Created 201) {String}  document.mimetype   Document's mime type
   * @apiSuccess (Created 201) {String}  document.size       Document's size
   * @apiSuccess (Created 201) {Date}    document.createdAt  Date
   * @apiSuccess (Created 201) {Date}    document.updatedAt  Date
   * @apiSuccess (Created 201) {Date}    document.deletedAt  Date
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden         Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound          File does not exist
   */
  .put(authorize([ADMIN, LOGGED_USER]), validate(replaceDocument), upload.single('document'), documentMiddleware.resize, documentController.update)

  /**
   * @api {patch} v1/documents/:id Update User
   * @apiDescription Update some fields of a file document
   * @apiVersion 1.0.0
   * @apiName UpdateDocument
   * @apiGroup Document
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess (Created 201) {String}  document.id         Document's id
   * @apiSuccess (Created 201) {String}  document.filename   Document's name
   * @apiSuccess (Created 201) {String}  document.path       Document's path
   * @apiSuccess (Created 201) {String}  document.mimetype   Document's mime type
   * @apiSuccess (Created 201) {String}  document.size       Document's size
   * @apiSuccess (Created 201) {Date}    document.createdAt  Date
   * @apiSuccess (Created 201) {Date}    document.updatedAt  Date
   * @apiSuccess (Created 201) {Date}    document.deletedAt  Date
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden         Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound          File does not exist
   */
  .patch(authorize([ADMIN, LOGGED_USER]), validate(updateDocument), upload.single('document'), documentMiddleware.resize, documentController.update)

  /**
   * @api {patch} v1/documents/:id Delete File
   * @apiDescription Delete a file
   * @apiVersion 1.0.0
   * @apiName DeleteDocument
   * @apiGroup Document
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize([ADMIN, LOGGED_USER]), validate(deleteDocument), documentController.remove);


export { router };