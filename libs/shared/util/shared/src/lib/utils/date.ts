export function isoStringToUnixTimestamp(isoStr: string): number {
  return Math.floor(new Date(isoStr).getTime() / 1000);
}
