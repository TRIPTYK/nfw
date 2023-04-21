import type { ResourceSchema } from '@triptyk/nfw-resources';

export type UserResource = {
  firstName?: string,
}

export const userSchema = {
  type: 'users',
  attributes: {
    firstName: {
      deserialize: true,
      serialize: true,
      type: 'string'
    }
  },
  relationships: {}
} satisfies ResourceSchema<UserResource>
