import { BaseSerializer } from "./base.serializer";

export class UserSerializer extends BaseSerializer {
  public static withelist : Array<String> = ['username','email','services','documents','recipes','firstname','lastname','role','createdAt'];

  constructor() {
    super('users',{
      id: 'id',
      attributes : UserSerializer.withelist
    })
  };
}
