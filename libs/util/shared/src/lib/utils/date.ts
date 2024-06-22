import { hasValue } from './type-guards';

export function isoStringToUnixTimestamp(isoStr: string): number {
  return Math.floor(new Date(isoStr).getTime() / 1000);
}

export function lowerIsoStringDate(d1: string | null | undefined, d2?: string | null | undefined): string | null {
  if (hasValue(d1) && hasValue(d2)) {
    return new Date(d1) < new Date(d2) ? d1 : d2;
  }

  return d1 ?? d2 ?? null;
}

export function greaterIsoStringDate(d1: string | null | undefined, d2: string | null | undefined): string | null {
  if (hasValue(d1) && hasValue(d2)) {
    return new Date(d1) > new Date(d2) ? d1 : d2;
  }

  return d1 ?? d2 ?? null;
}
