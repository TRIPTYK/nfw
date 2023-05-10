export function unixTimestamp (): number {
  return Math.ceil(Date.now() / 1000);
}
