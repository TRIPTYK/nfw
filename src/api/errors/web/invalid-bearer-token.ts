import { WebError } from './web-error.js';

export class InvalidBearerTokenError extends WebError {
  status = 417;
}
