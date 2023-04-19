import type { ResourceSchema } from '@triptyk/nfw-resources';

type UserResource = {
    name: string,
}

export const userSchema = {
  type: 'users',
  attributes: {
    name: {
      deserialize: true,
      serialize: true,
      type: 'string'
    }
  },
  relationships: {}
} satisfies ResourceSchema<UserResource>
