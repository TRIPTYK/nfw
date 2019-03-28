import { BaseSerializer } from "./base.serializer";

class SerializerParams {

    /**
     * Serializer options    
     */
    private options : any = {
        attributes : [],
        dataLinks : {},
        topLevelLinks : {}
    };

    constructor(options = null) {
      if (options)
        this.options = options;
    }


    /**
     * Set attributes to serializer , attributes are meant to be properties who will be serialized
     */
    public setAttributes(attributes : Array<string>)
    {
      this.options.attributes = attributes;
      return this;
    };


    /**
     * Set data links for each entity
     */
    public setDataLinks(dataLinks: { self: Function; })
    {
      this.options.dataLinks = dataLinks;
      return this;
    }


    /**
     * Set top level links for pagination
     */
    public setTopLevelLinks(dataLinks: { self: Function|string; next: Function; prev: Function|string; first: Function|string; last: Function|string; })
    {
      this.options.topLevelLinks = dataLinks;
      return this;
    }


    /**
     * Add a relation , can be nested objects
     */
    public addRelation(key : string,relation : any)
    {
      this.options[key] = relation;
      return this;
    }


    /**
     *
     */
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
