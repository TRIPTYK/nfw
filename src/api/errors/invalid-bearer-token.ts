import { HttpError } from 'koa';

export class InvalidBearerTokenError extends HttpError {
  status = 417;
}
