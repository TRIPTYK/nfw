import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

const whitelist = [ 
  'fieldname', 
  'filename', 
  'path', 
  'mimetype', 
  'size', 
  'user', 
  'createdAt' 
];

const documentSerializer = new JSONAPISerializer('documents', {
  id: 'id',
  attributes: whitelist,
  convertCase: "kebab-case",
  unconvertCase: "camelCase"
});

export { documentSerializer, whitelist }