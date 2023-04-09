import { HttpError } from 'koa';

export class InvalidRefreshTokenError extends HttpError {
  status = 417;
}
