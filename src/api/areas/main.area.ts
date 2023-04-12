import { Controller, UseMiddleware } from '@triptyk/nfw-http';
import { AuthController } from '../controllers/auth.controller.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';

@Controller({
  controllers: [AuthController],
  routeName: '/api/v1'
})
@UseMiddleware(CurrentUserMiddleware)
export class MainArea {

}
