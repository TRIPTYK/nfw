import type { JSONAPIDocument } from 'json-api-serializer';

export interface JsonApiSerializerInterface<T> {
    serialize(data : T | T[], extraData?: Record<string, unknown>): Promise<JSONAPIDocument>,
}
