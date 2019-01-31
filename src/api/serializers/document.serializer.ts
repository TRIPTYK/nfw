import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

const documentSerializer = new JSONAPISerializer('documents', {
  id: 'id',
  attributes: [ 
    'fieldname', 
    'filename', 
    'path', 
    'mimetype', 
    'size', 
    'user', 
    'createdAt' 
  ],
  convertCase: "kebab-case",
  unconvertCase: "camelCase"
});

export { documentSerializer }