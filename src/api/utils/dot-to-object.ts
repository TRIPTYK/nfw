export function dotToObject (str: string, outObj?: Record<string, unknown>, order?: 'ASC' | 'DESC'): Record<string, unknown> {
  if (!outObj) {
    outObj = {} as Record<string, unknown>;
  }

  if (!order) {
    if (str.startsWith('-')) {
      order = 'DESC';
      str = str.substring(1);
    } else {
      order = 'ASC';
    }
  }

  const splitted = str.split('.');
  const currentRel = splitted[0];
  const rest = splitted.slice(1);

  if (rest.length) {
    outObj[currentRel] = {};
    dotToObject(rest.join('.'), outObj[currentRel] as Record<string, unknown>, order);
  } else {
    outObj[currentRel] = order;
  }

  return outObj;
}
