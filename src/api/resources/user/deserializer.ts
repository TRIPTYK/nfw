import { JsonApiResourceDeserializer } from '@triptyk/nfw-resources';
import type { userSchema } from './schema.js';

export class UsersDeserializer extends JsonApiResourceDeserializer<typeof userSchema> {}
