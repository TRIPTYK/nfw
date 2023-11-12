import { WebError } from './web-error.js';

export class TooManyRequestsError extends WebError {
  status = 429;
}
