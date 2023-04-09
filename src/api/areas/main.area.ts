import { Controller, UseMiddleware } from '@triptyk/nfw-http';
import { AuthController } from '../controllers/auth.controller.js';
import { DefaultErrorHandler } from '../error-handler/default.error-handler.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import { LogMiddleware } from '../middlewares/log.middleware.js';

@Controller({
  controllers: [AuthController],
  routeName: '/api/v1'
})
@UseMiddleware(DefaultErrorHandler)
@UseMiddleware(CurrentUserMiddleware)
@UseMiddleware(LogMiddleware)
export class MainArea {

}
