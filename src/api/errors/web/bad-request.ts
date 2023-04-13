export class BadRequestError extends Error {
  message = 'Bad Request';
  status = 400;
}
