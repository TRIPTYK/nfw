export function unixTimestamp (): number {
  return Math.floor(Date.now() / 1000);
}
