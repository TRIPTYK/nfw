import { WebError } from '../../../errors/web-error.js';

export class InvalidBearerTokenError extends WebError {
  status = 417;
}
