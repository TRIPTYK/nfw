import { Request } from "express"

export class SerializerParams {

  private paginationData : {
    total : number,
    request : Request
  } = {
    total : null,
    request : null
  };
  private type : string = null;

  public constructor() {
    this.paginationData = {
      total : null,
      request : null
    };
    this.type = null;
  }

  public enablePagination(request : Request,total : number) : this
  {
    this.paginationData = {
      total,
      request
    };
    return this;
  }

  public getPaginationData()
  {
    return this.paginationData;
  }

  public hasPaginationEnabled() : boolean
  {
    if (this.paginationData && this.paginationData.total && this.paginationData.request)
      return true;
    else
      return false;
  }

  public setType(serializerType : string) : this
  {
    this.type = serializerType;
    return this;
  }

  public getType() : string
  {
    return this.type;
  }
}
