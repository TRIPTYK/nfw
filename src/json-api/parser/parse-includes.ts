export function parseIncludes (includes?: string) {
  if (!includes) return [];
  return includes.split(',');
}

export function parseSort (sorts?: string) {
  if (!sorts) return {};

  const ret = {} as Record<string, 'DESC' | 'ASC'>;

  for (const sort of sorts.split(',')) {
    const order = sort.startsWith('-') ? 'DESC' : 'ASC';
    ret[order === 'ASC' ? sort : sort.slice(1)] = order;
  }

  return ret;
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
