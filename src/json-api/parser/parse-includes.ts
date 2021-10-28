export function parseIncludes (includes?: string) {
  if (!includes) return [];
  return includes.split(',');
}

export function parseSort (includes?: string) {
  if (!includes) return;
  return includes.split(',');
}

export function parseFields (includes?: string | Record<string, any>) : Record<string, string[]> | string[] {
  if (!includes) return [];
  if (typeof includes === 'string') {
    return includes.split(',');
  } else {
    return parseFields(includes);
  }
}
