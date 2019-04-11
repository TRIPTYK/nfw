import { BaseSerializer } from "./base.serializer";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";
import { SerializerParams } from "./serializerParams";
import { User } from "../models/user.model";
import { Document } from "../models/document.model";
import { getRepository } from "typeorm";
import { UserRepository } from "../repositories/user.repository";
import { DocumentSerializer } from "./document.serializer";
import { fullLog, shadowLog } from "../utils/log.util";


export class UserSerializer extends BaseSerializer {
  public static withelist : Array<string> = ['username','email','services','documents','recipes','firstname','lastname','role','createdAt','updatedAt','avatar'];

  constructor(ss : SerializerParams = new SerializerParams()) {

    const data = {
      attributes : UserSerializer.withelist,
      dataLinks : {
        self : (dataSet,data) => {
          if (data.id)
            return `${url}/api/${api}/${this.type}/${data.id}`
        }
      },
      documents : {
        ref:'id',
        attributes:DocumentSerializer.withelist,
        valueForRelationship: async function (relationship) {
           return await getRepository(Document).findOne(relationship.id);
       }
      }
    };

    if (ss.hasPaginationEnabled())
    {
      const { total , request } = ss.getPaginationData();
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

    super(ss.getType() ? ss.getType() : 'users',data);
  };
}
