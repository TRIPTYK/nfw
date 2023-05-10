export class BadRequestError extends Error {
  message = 'Bad Request';
  status = 400;
}

export function createBadRequestError (err: {message: string}) {
  throw new BadRequestError(err.message);
}
