import { Controller, UseMiddleware } from '@triptyk/nfw-http';
import { AuthController } from '../features/auth/controllers/auth.controller.js';
import { DocumentsController } from '../features/users/controllers/documents.controller.js';
import { UsersController } from '../features/users/controllers/users.controller.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';

@Controller({
  controllers: [AuthController, UsersController, DocumentsController],
  routeName: '/api/v1',
})
@UseMiddleware(CurrentUserMiddleware)
export class MainArea {

}
