import type { ResourceSchema } from '@triptyk/nfw-resources';

export const RESOURCE_NAME = 'users';

export type UserResource = {
  type: typeof RESOURCE_NAME,
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
}

export const userSchema = {
  type: RESOURCE_NAME,
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
