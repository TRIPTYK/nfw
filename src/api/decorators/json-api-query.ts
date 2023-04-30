import { container } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { JsonApiQueryParserImpl, ResourcesRegistryImpl } from '@triptyk/nfw-resources';

export function parseJsonApiQuery (search: string, type: string) {
  const parser = new JsonApiQueryParserImpl(container.resolve(ResourcesRegistryImpl));
  const query = parser.parse(search, type);
  return query;
}

export function JsonApiQueryDecorator (type: string) {
  return createCustomDecorator(({ ctx }) => {
    return parseJsonApiQuery(ctx.search, type);
  }, 'json-api-query');
}
