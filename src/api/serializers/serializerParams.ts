import { BaseSerializer } from "./base.serializer";

class SerializerParams {
    private options : any = {
        attributes : [],
        dataLinks : {},
        topLevelLinks : {}
    };

    constructor(options = null) {
      if (options)
        this.options = options;
    }

    public setAttributes(attributes : Array<string>)
    {
      this.options.attributes = attributes;
      return this;
    };

    public setDataLinks(dataLinks: { self: Function; })
    {
      this.options.dataLinks = dataLinks;
      return this;
    }

    public setTopLevelLinks(dataLinks: { self: Function|string; next: Function; prev: Function|string; first: Function|string; last: Function|string; })
    {
      this.options.topLevelLinks = dataLinks;
      return this;
    }

    public addRelation(key : string,relation : any)
    {
      this.options[key] = relation;
      return this;
    }

    public loadRelation(serializer : BaseSerializer)
    {
      this.options[serializer.type] = serializer.options;
      return this;
    }

    public addProperty(key : string,value : any)
    {
      this.options[key] = value;
      return this;
    }

    public getOptions()
    {
      return this.options;
    }
};

export { SerializerParams }
