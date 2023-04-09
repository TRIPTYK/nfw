import { HttpError } from 'koa';

export class InvalidUserNameOrPasswordError extends HttpError {
  status = 417;
}
