import { WebError } from '../../../errors/web-error.js';

export class InvalidRefreshTokenError extends WebError {
  status = 417;
}
