import { HttpError } from 'koa';

export class UserNotFoundError extends HttpError {
  status = 404;
}
