export function parseIncludes (includes?: string) {
  if (!includes) return [];
  return includes.split(',');
}

export function parseSort (includes?: string) {
  if (!includes) return [];
  return includes.split(',');
}

export function parseFields (fields?: string | Record<string, any>, parserResult?: Record<string, any>) : Record<string, any> {
  if (fields === undefined) return {};

  if (parserResult === undefined) {
    parserResult = {};
    if (typeof fields === 'string') {
      parserResult.$$default = fields.split(',');
      return parserResult;
    }
  }

  for (const [key, value] of Object.entries(fields).filter(([key, value]) => key !== '$$default')) {
    if (typeof value === 'object') {
      parserResult[key] = parseFields(value, parserResult[key]);
    } else {
      parserResult[key] = value.split(',');
    }
  }

  return parserResult;
}
