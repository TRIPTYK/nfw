export function unixTimestamp (): number {
  return Math.round(Date.now() / 1000);
}
