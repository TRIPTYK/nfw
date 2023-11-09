import type { ResourceSchema } from '@triptyk/nfw-resources';

export type UserResource = {
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  resourceType: 'users',
}

export const userSchema = {
  resourceType: 'users',
  attributes: {
    firstName: {
      deserialize: true,
      serialize: true,
      type: 'string'
    },
    lastName: {
      deserialize: true,
      serialize: true,
      type: 'string'
    },
    email: {
      deserialize: true,
      serialize: true,
      type: 'string'
    },
    password: {
      deserialize: false,
      serialize: false,
      type: 'string'
    },
  },
  relationships: {}
} satisfies ResourceSchema<UserResource>
