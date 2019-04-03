import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "./serializerParams";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user.model";
import { UserSerializer } from "./user.serializer";

export class DocumentSerializer extends BaseSerializer {
  public static withelist : Array<string> = ['fieldname','filename','path','mimetype','size','user','createdAt'];

  constructor(request : Request = null,totalCount : number = null) {
    let params = new SerializerParams();

    params
    .setAttributes(DocumentSerializer.withelist)
    .setDataLinks({
      self : (dataSet,data) => {
        if (data.id)
          return `${url}/api/${api}/${this.type}/${data.id}`
      }
    })
    .addRelation('user',{
      ref : 'id',
      attributes : UserSerializer.withelist,
      valueForRelationship: async function (relationship) {
        return await getRepository(User).findOne(relationship.id);
      }
    });

    if (request && (request.query.page && request.query.page.number && request.query.page.size) && totalCount) {
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

    super('documents', params );
  };

}
