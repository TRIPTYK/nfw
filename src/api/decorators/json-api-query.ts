import { createCustomDecorator } from '@triptyk/nfw-http';
import { Parser } from 'json-api-query-parser';

export function JsonApiQueryDecorator () {
  return createCustomDecorator(({ ctx }) => {
    const parser = new Parser();
    const query = parser.parse(ctx.search);
    return query;
  }, 'json-api-query');
}
