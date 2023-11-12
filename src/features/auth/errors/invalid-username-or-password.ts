import { WebError } from '../../../errors/web-error.js';

export class InvalidUserNameOrPasswordError extends WebError {
  status = 417;
}
