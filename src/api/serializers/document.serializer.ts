import { BaseSerializer } from "./base.serializer";

export class DocumentSerializer extends BaseSerializer {
  public static withelist : Array<String> = ['fieldname','filename','path','mimetype','size','user','createdAt'];

  constructor() {
    super('documents',{
      id : 'id',
      attributes : DocumentSerializer.withelist
    });
  };

}
