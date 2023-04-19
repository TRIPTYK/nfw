import { createCustomDecorator } from '@triptyk/nfw-http';
import { Parser } from 'json-api-query-parser';

export function parseJsonApiQuery (search: string) {
  const parser = new Parser();
  const query = parser.parse(search);
  return query;
}

export function JsonApiQueryDecorator () {
  return createCustomDecorator(({ ctx }) => {
    return parseJsonApiQuery(ctx.search);
  }, 'json-api-query');
}
