import { BaseSerializer } from "./base.serializer";
import { api, env , port, url } from "../../config/environment.config";
import { Request } from "express";


export class JijiSerializer extends BaseSerializer {

  public static withelist : Array<String> = [];

  constructor(request : Request = null,totalCount : number = 0) {
    super('jijis', JijiSerializer.withelist,{ 
    },{},{
      self : (dataSet) => {
        if (request && request.query.page) {
          return `${url}/api/${api}/${this.type}${request.url}`;
        }
      },
      first : (dataSet) => {
        if (request && request.query.page) {
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,1)}`;
        }
      },
      next : (dataSet) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,parseInt(page) + 1)}`;
        }
      },
      prev : (dataSet) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,parseInt(page) - 1 < 1 ? page : page - 1)}`;
        }
      },
      last : (dataSet) => {
        if (request && request.query.page) {
          let page = request.query.page.number;
          let size = request.query.page.size;

          return `${url}/api/${api}/${this.type}${this.replacePage(request.url,Math.ceil(totalCount / size))}`;
        }
      }
    });
  }
}
