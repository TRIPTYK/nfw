import * as Validation from "../../validations/comment.validation";
import { Router } from "express";
import { CommentController } from "../../controllers/comment.controller";
import { CommentMiddleware } from "../../middlewares/comment.middleware";
import { authorize } from "../../middlewares/auth.middleware";
import { roles } from "../../enums/role.enum";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import { relationships } from "@triptyk/nfw-core";

const router = Router();
const commentController = new CommentController();
const commentMiddleware = new CommentMiddleware();


router.route('/')
	.get(authorize([roles.admin]), commentController.method('list'))
	.post(authorize([roles.admin]),commentMiddleware.deserialize(),commentMiddleware.handleValidation(Validation.createComment), SecurityMiddleware.sanitize, commentController.method('create'))
;


router.route('/:id')
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(Validation.getComment), commentController.method('get'))
	.put(authorize([roles.admin]),commentMiddleware.deserialize(),commentMiddleware.handleValidation(Validation.replaceComment), SecurityMiddleware.sanitize, commentController.method('update'))
	.patch(authorize([roles.admin]),commentMiddleware.deserialize(),commentMiddleware.handleValidation(Validation.updateComment), SecurityMiddleware.sanitize, commentController.method('update'))
	.delete(authorize([roles.admin]), commentMiddleware.handleValidation(Validation.getComment), commentController.method('remove'))
;


router.route('/:id/:relation')
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(relationships), commentController.method('fetchRelated'))
;


router.route('/:id/relationships/:relation')
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(relationships), commentController.method('fetchRelationships'))
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(relationships), commentController.method('addRelationships'))
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(relationships), commentController.method('updateRelationships'))
	.get(authorize([roles.admin]), commentMiddleware.handleValidation(relationships), commentController.method('removeRelationships'))
;
export { router }








