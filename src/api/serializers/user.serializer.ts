import { BaseSerializer } from "./base.serializer";
import { DocumentSerializer } from "./document.serializer";

export class UserSerializer extends BaseSerializer {
  public static withelist : Array<String> = ['username','email','services','documents','recipes','firstname','lastname','role','createdAt'];

  constructor() {
    super('users',UserSerializer.withelist,{
      documents : {
        ref : 'id',
        attributes : DocumentSerializer.withelist,
      }
    });
  };
}
