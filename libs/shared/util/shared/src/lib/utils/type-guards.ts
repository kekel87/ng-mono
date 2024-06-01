export function hasValue<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

export function isRecord(input: unknown): input is Record<string, unknown> {
  return hasValue(input) && typeof input === 'object' && !Array.isArray(input);
}

export function isEmpty<T>(input: null | undefined | T): input is T {
  if (typeof input === 'string') {
    return input.trim().length === 0;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  if (isRecord(input)) {
    return Object.keys(input).length === 0;
  }

  return !hasValue<T>(input);
}
