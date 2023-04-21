import type { ResourceSchema } from '@triptyk/nfw-resources';
import type { MimeTypes } from '../../enums/mime-type.enum';

export type DocumentResource = {
  filename: string,
  originalName: string,
  path: string,
  size: number,
  mimetype: MimeTypes,
}

export const documentSchema = {
  type: 'documents',
  attributes: {
    filename: {
      deserialize: true,
      serialize: true,
      type: 'string',
    },
    originalName: {
      deserialize: true,
      serialize: true,
      type: 'string',
    },
    path: {
      deserialize: true,
      serialize: true,
      type: 'string',
    },
    size: {
      deserialize: true,
      serialize: true,
      type: 'string',
    },
    mimetype: {
      deserialize: true,
      serialize: true,
      type: 'string',
    },
  },
  relationships: {},
} satisfies ResourceSchema<DocumentResource>
