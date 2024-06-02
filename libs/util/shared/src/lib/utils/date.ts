export function isoStringToUnixTimestamp(isoStr: string): number {
  return Math.floor(new Date(isoStr).getTime() / 1000);
}

export function lowerIsoStringDate(d1?: string, d2?: string): string | undefined {
  if (d1 === undefined && d2 === undefined) {
    return undefined;
  }

  if (d1 === undefined) {
    return d2;
  }

  if (d2 === undefined) {
    return d1;
  }

  return new Date(d1) < new Date(d2) ? d1 : d2;
}

export function greaterIsoStringDate(d1?: string, d2?: string): string | undefined {
  if (d1 === undefined && d2 === undefined) {
    return undefined;
  }

  if (d1 === undefined) {
    return d2;
  }

  if (d2 === undefined) {
    return d1;
  }

  return new Date(d1) > new Date(d2) ? d1 : d2;
}
