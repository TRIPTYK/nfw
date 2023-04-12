import { WebError } from './web-error.js';

export class InvalidRefreshTokenError extends WebError {
  status = 417;
}
