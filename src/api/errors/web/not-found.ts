import { WebError } from './web-error.js';

export class NotFoundError extends WebError {
  status = 404;
  message = 'Not found';
}
