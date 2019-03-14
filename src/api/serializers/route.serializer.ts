import { BaseSerializer } from "./base.serializer";


export class RouteSerializer extends BaseSerializer {

  public static withelist : Array<String> = ['methods','path'];

  constructor() {
    super('routes',RouteSerializer.withelist);
  }
}
