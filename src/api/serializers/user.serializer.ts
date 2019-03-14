import { BaseSerializer } from "./base.serializer";
import { DocumentSerializer } from "./document.serializer";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";

export class UserSerializer extends BaseSerializer {
  public static withelist : Array<String> = ['username','email','services','documents','recipes','firstname','lastname','role','createdAt'];

  constructor(request : Request = null,totalCount : number = 0) {
    super('users',UserSerializer.withelist,{
      documents : {
        ref : 'id',
        attributes : DocumentSerializer.withelist,
      }
    },{
      first : (dataSet,set) => {
        if (request && request.query.page) {
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,1)}`;
        }
      },
      next : (dataSet,set) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,parseInt(page) + 1)}`;
        }
      },
      prev : (dataSet,set) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,parseInt(page) - 1 < 1 ? page : page - 1)}`;
        }
      },
      last : (dataSet,set) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          let size = request.query.page.size;

          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,Math.ceil(totalCount / size))}`;
        }
      },
    });
  };
}
