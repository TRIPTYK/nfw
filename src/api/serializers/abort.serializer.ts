import { BaseSerializer } from "./base.serializer";
import { api, env , port, url } from "../../config/environment.config";
import { SerializerParams } from "./serializerParams";
import { Request } from "express";


export class AbortSerializer extends BaseSerializer {

  public static withelist : Array<string> = [];

  constructor(request : Request = null,totalCount : number = null) {
    let params = new SerializerParams();

    params
    .setAttributes(AbortSerializer.withelist)
    
    .setDataLinks({
      self : (dataSet,data) => `${url}/api/${api}/${this.type}/${data.id}`
    });

    if (request && request.query.page && totalCount) {
      const page = parseInt(request.query.page.number);
      const size = request.query.page.size;
      const baseUrl = `${url}/api/${api}`;
      const max = Math.ceil(totalCount / size);

      params.setTopLevelLinks({
        self : () =>  `${baseUrl}/${this.type}${request.url}`,
        next : () => `${baseUrl}/${this.type}${this.replacePage(request.url,page + 1 > max ? max  : page + 1)}`,
        prev : () => `${baseUrl}/${this.type}${this.replacePage(request.url,page - 1 <   1 ? page : page - 1)}`,
        last : () => `${baseUrl}/${this.type}${this.replacePage(request.url,max)}` ,
        first : () =>  `${baseUrl}/${this.type}${this.replacePage(request.url,1)}`
      })
    }

    super('aborts',params);
  }
}
