import { BaseSerializer } from "./base.serializer";

export class UserSerializer extends BaseSerializer {

  constructor() {


    super('users',{
      id: 'id',
      attributes : ['username','email','services','documents','recipes','firstname','lastname','role','createdAt'],
      recipes : {
        ref: 'id',
        attributes : ['title']
      }
    })
  };
}
