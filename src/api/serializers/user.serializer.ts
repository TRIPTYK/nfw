import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

const whitelist = [ 
  'username', 
  'email', 
  'services', 
  'documents', 
  'firstname', 
  'lastname', 
  'role', 
  'createdAt' 
];

const userSerializer = new JSONAPISerializer('users', {
  id: 'id',
  attributes: whitelist,
  convertCase: "kebab-case",
  unconvertCase: "camelCase"
});

export { userSerializer , whitelist }