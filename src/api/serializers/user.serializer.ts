import { BaseSerializer } from "./base.serializer";

export class UserSerializer extends BaseSerializer {

  constructor() { super('users', [ 
    'username', 
    'email', 
    'services', 
    'documents', 
    'firstname', 
    'lastname', 
    'role', 
    'createdAt' 
  ]) };

}