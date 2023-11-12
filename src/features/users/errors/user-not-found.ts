import { WebError } from '../../../errors/web-error.js';

export class UserNotFoundError extends WebError {
  status = 404;
}
