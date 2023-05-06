import { container } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { JsonApiQueryParserImpl } from '@triptyk/nfw-resources';

export function parseJsonApiQuery (search: string, type: string) {
  const parser = container.resolve(JsonApiQueryParserImpl);
  const query = parser.parse(search, type);
  return query;
}

export function JsonApiQueryDecorator (type: string) {
  return createCustomDecorator(({ ctx }) => {
    return parseJsonApiQuery(ctx.search, type);
  }, 'json-api-query');
}
