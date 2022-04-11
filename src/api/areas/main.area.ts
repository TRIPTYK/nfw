import { Area } from '@triptyk/nfw-core';
import { AuthController } from '../controllers/auth.controller.js';
import { DocumentController } from '../controllers/document.controller.js';
import { UsersController } from '../controllers/user.controller.js';

@Area({
  controllers: [AuthController, UsersController, DocumentController],
})
export class MainArea {

}
