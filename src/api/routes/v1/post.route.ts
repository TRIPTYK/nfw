import * as Validation from "../../validations/post.validation";
import { Router } from "express";
import { PostController } from "../../controllers/post.controller";
import { PostMiddleware } from "../../middlewares/post.middleware";
import { authorize } from "../../middlewares/auth.middleware";
import { roles } from "../../enums/role.enum";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import { relationships } from "@triptyk/nfw-core";

const router = Router();
const postController = new PostController();
const postMiddleware = new PostMiddleware();


router.route('/')
	.get(authorize([roles.admin]), postController.method('list'))
	.post(authorize([roles.admin]),postMiddleware.deserialize(),postMiddleware.handleValidation(Validation.createPost), SecurityMiddleware.sanitize, postController.method('create'))
;


router.route('/:id')
	.get(authorize([roles.admin]), postMiddleware.handleValidation(Validation.getPost), postController.method('get'))
	.put(authorize([roles.admin]),postMiddleware.deserialize(),postMiddleware.handleValidation(Validation.replacePost), SecurityMiddleware.sanitize, postController.method('update'))
	.patch(authorize([roles.admin]),postMiddleware.deserialize(),postMiddleware.handleValidation(Validation.updatePost), SecurityMiddleware.sanitize, postController.method('update'))
	.delete(authorize([roles.admin]), postMiddleware.handleValidation(Validation.getPost), postController.method('remove'))
;


router.route('/:id/:relation')
	.get(authorize([roles.admin]), postMiddleware.handleValidation(relationships), postController.method('fetchRelated'))
;


router.route('/:id/relationships/:relation')
	.get(authorize([roles.admin]), postMiddleware.handleValidation(relationships), postController.method('fetchRelationships'))
	.get(authorize([roles.admin]), postMiddleware.handleValidation(relationships), postController.method('addRelationships'))
	.get(authorize([roles.admin]), postMiddleware.handleValidation(relationships), postController.method('updateRelationships'))
	.get(authorize([roles.admin]), postMiddleware.handleValidation(relationships), postController.method('removeRelationships'))
;
export { router }








