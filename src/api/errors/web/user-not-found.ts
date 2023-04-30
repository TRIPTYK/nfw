import { WebError } from './web-error.js';

export class UserNotFoundError extends WebError {
  status = 404;
}
