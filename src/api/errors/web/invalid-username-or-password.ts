import { WebError } from './web-error.js';

export class InvalidUserNameOrPasswordError extends WebError {
  status = 417;
}
