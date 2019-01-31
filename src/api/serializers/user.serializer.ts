import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

const userSerializer = new JSONAPISerializer('users', {
  id: 'id',
  attributes: [ 
    'username', 
    'email', 
    'services', 
    'documents', 
    'firstname', 
    'lastname', 
    'role', 
    'createdAt' 
  ],
  convertCase: "kebab-case",
  unconvertCase: "camelCase"
});

export { userSerializer }