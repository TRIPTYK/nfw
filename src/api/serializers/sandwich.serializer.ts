import { BaseSerializer } from "./base.serializer";


export class SandwichSerializer extends BaseSerializer {

  public static withelist : Array<String> = ['enum'];

  constructor() {
    super('sandwichs', {
        id : 'id',
        attributes : SandwichSerializer.withelist,
        
    });
  }

}
