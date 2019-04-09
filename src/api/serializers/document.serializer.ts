import { BaseSerializer } from "./base.serializer";
import { SerializerParams } from "./serializerParams";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user.model";
import { UserSerializer } from "./user.serializer";
import { fullLog } from "../utils/log.util";

export class DocumentSerializer extends BaseSerializer {
  public static withelist : Array<string> = ['fieldname','filename','path','mimetype','size','user','createdAt'];

  constructor(serializerParams = null) {

    if (!serializerParams) serializerParams = new SerializerParams();

    const data = {
      attributes : DocumentSerializer.withelist,
      dataLinks : {
        self : (dataSet,data) => {
          if (data.id)
            return `${url}/api/${api}/${this.type}/${data.id}`
        }
      },
      user : {
        ref:'id',
        attributes:UserSerializer.withelist,
        valueForRelationship: async function (relationship) {
           return await getRepository(User).findOne(relationship.id);
       }
      }
    };

    if (serializerParams.hasPaginationEnabled())
    {
      const { total , request } = serializerParams.getPaginationData();
      const page = parseInt(request.query.page.number);
      const size = request.query.page.size;
      const baseUrl = `${url}/api/${api}`;
      const max = Math.ceil(total / size);

      data["topLevelLinks"] = {
        self : () =>  `${baseUrl}/${this.type}${request.url}`,
        next : () => `${baseUrl}/${this.type}${this.replacePage(request.url,page + 1 > max ? max  : page + 1)}`,
        prev : () => `${baseUrl}/${this.type}${this.replacePage(request.url,page - 1 <   1 ? page : page - 1)}`,
        last : () => `${baseUrl}/${this.type}${this.replacePage(request.url,max)}` ,
        first : () =>  `${baseUrl}/${this.type}${this.replacePage(request.url,1)}`
      }
    }

    super(serializerParams.getType() ? serializerParams.getType() : 'documents', data );
  };

}
