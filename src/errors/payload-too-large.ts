export class PayloadTooLargeError extends Error {
  message = 'Payload too large';
  status = 417;
}
