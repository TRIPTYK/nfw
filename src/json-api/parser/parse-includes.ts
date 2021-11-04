export function parseIncludes (includes?: string) {
  if (!includes) return [];
  return includes.split(',');
}

export interface SortObject {
  [x: string] : SortObject | ('ASC' | 'DESC'),
}

export function parseSort (sorts?: string): string[] {
  if (!sorts) return [];

  return sorts.split(',');
}

export function parseFields (fields?: string | Record<string, any>, parserResult?: string[]) : string[] {
  if (fields === undefined) return [];

  if (parserResult === undefined) {
    if (typeof fields === 'string') {
      return fields.split(',');
    }
    parserResult = [];
  }

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'object') {
      parseFields(value, parserResult);
    } else {
      parserResult.push(...value.split(',').map((e: string) => `${key}.${e}`));
    }
  }

  return parserResult;
}
