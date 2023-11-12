import type { IncludeQuery } from '@triptyk/nfw-resources';

export function transformIncludesQuery (includes: IncludeQuery[]): string[] {
  const transformedIncludes: string[] = [];

  includes.forEach(({ relationName, nested }) => {
    if (nested.length) {
      transformIncludesQuery(nested).forEach(nestedInclude => {
        transformedIncludes.push(`${relationName}.${nestedInclude}`);
      });
    } else {
      transformedIncludes.push(relationName);
    }
  });

  return transformedIncludes;
}
