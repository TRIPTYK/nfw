import { Controller, UseMiddleware } from '@triptyk/nfw-http';
import { AuthController } from '../controllers/auth.controller.js';
import { DocumentsController } from '../controllers/documents.controller.js';
import { UsersController } from '../controllers/users.controller.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';

@Controller({
  controllers: [AuthController, UsersController, DocumentsController],
  routeName: '/api/v1',
})
@UseMiddleware(CurrentUserMiddleware)
export class MainArea {

}
