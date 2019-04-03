import { BaseSerializer } from "./base.serializer";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";
import { SerializerParams } from "./serializerParams";
import { User } from "../models/user.model";
import { getRepository } from "typeorm";
import { UserRepository } from "../repositories/user.repository";
import { DocumentSerializer } from "./document.serializer";


export class UserSerializer extends BaseSerializer {
  public static withelist : Array<string> = ['username','email','services','documents','recipes','firstname','lastname','role','createdAt'];

  constructor(request : Request = null,totalCount : number = null) {
    let params = new SerializerParams();

    params
      .setAttributes(UserSerializer.withelist)
      .addRelation('documents',{
         ref:'id',
         attributes:DocumentSerializer.withelist,
         valueForRelationship: async function (relationship) {
            return await getRepository(Document).findOne(relationship.id);
        }
      })
      .setDataLinks({
        self : (dataSet,data) => {
          if (data.id)
            return `${url}/api/${api}/${this.type}/${data.id}`
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

    super('users',params);
  };
}
