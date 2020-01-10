import * as Validation from "../../validations/setting.validation";
import { Router } from "express";
import { SettingController } from "../../controllers/setting.controller";
import { SettingMiddleware } from "../../middlewares/setting.middleware";
import { authorize } from "../../middlewares/auth.middleware";
import { roles } from "../../enums/role.enum";
import { SecurityMiddleware } from "../../middlewares/security.middleware";
import { relationships } from "@triptyk/nfw-core";

const router = Router();
const settingController = new SettingController();
const settingMiddleware = new SettingMiddleware();


router.route('/')
	.get(authorize([roles.admin]), settingController.method('list'))
	.post(authorize([roles.admin]),settingMiddleware.deserialize(),settingMiddleware.handleValidation(Validation.createSetting), SecurityMiddleware.sanitize, settingController.method('create'))
;


router.route('/:id')
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(Validation.getSetting), settingController.method('get'))
	.put(authorize([roles.admin]),settingMiddleware.deserialize(),settingMiddleware.handleValidation(Validation.replaceSetting), SecurityMiddleware.sanitize, settingController.method('update'))
	.patch(authorize([roles.admin]),settingMiddleware.deserialize(),settingMiddleware.handleValidation(Validation.updateSetting), SecurityMiddleware.sanitize, settingController.method('update'))
	.delete(authorize([roles.admin]), settingMiddleware.handleValidation(Validation.getSetting), settingController.method('remove'))
;


router.route('/:id/:relation')
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(relationships), settingController.method('fetchRelated'))
;


router.route('/:id/relationships/:relation')
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(relationships), settingController.method('fetchRelationships'))
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(relationships), settingController.method('addRelationships'))
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(relationships), settingController.method('updateRelationships'))
	.get(authorize([roles.admin]), settingMiddleware.handleValidation(relationships), settingController.method('removeRelationships'))
;
export { router }








