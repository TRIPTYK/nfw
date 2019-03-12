import { getConnection, Connection } from "typeorm";
import { typeorm as TypeORM } from "./../../config/environment.config";

/**
 * Main controller contains properties/methods
 */
abstract class BaseController {

  /**
   * Store the TypeORM current connection to database
   *
   * @property Connection
   * @protected
   */
  protected connection : Connection;

  /**
   * Super constructor
   * Retrieve database connection, and store it into connection
   */
  constructor() { this.connection = getConnection(TypeORM.name); }


  /**
   * @description : Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/ (VERSION 1.0)
   */
  protected static JSONAPIRequest(query : any) : any {
    const splitAndFilter = (string : string) => string.split(',').filter(string => string != '');  //split parameters and filter empty strings

    let options = {
      relations : [],
      order : {},
      take : null,
      skip : null
    };

    /**
     * Check if include parameter exists
     * An endpoint MAY also support an include request parameter to allow the client to customize which related resources should be returned.
     * @ref : https://jsonapi.org/format/#fetching-includes
     */
    if (query.include)
    {
      let includes = splitAndFilter(query.include);
      includes.forEach( (include: string) => options.relations.push(include) );
    }


    /**
     * Check if fields parameter exists
     * A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
     * @ref : https://jsonapi.org/format/#fetching-sparse-fieldsets
     */
    if (query.fields)
    {
      if (typeof query.fields === "string") {
        splitAndFilter(query.fields)
          .forEach(elem => options["select"].push(elem) );
      }else{
        for (let property in query.fields) {
            splitAndFilter(query.fields[property])
              .forEach(elem => options["select"].push(`${property}.${elem}`));
        }
      }
    }


    /**
     * Check if sort parameter exists
     * A server MAY choose to support requests to sort resource collections according to one or more criteria (“sort fields”).
     * @ref : https://jsonapi.org/format/#fetching-sorting
     */
    if (query.sort)
    {
       let sortFields = splitAndFilter(query.sort); //split parameters and filter empty strings

       // need to use SqlString.escapeId in order to prevent SQL injection on orderBy()
       sortFields.forEach((field : string) => {
        if (field[0] == "-") {  // JSON-API convention , when sort field starts with '-' order is DESC
          options.order[field.substr(1)] = "DESC"; //
        }else{
          options.order[field] = "ASC";
        }
       });
    }


    /**
     * Check if pagination is enabled
     * A server MAY choose to limit the number of resources returned in a response to a subset (“page”) of the whole set available.
     * @ref : https://jsonapi.org/format/#fetching-pagination
     */
    if (query.page && query.page.number && query.page.size)
    {
      let number = query.page.number;
      let size = query.page.size;

      options.skip =  (number - 1) * size ;
      options.take =  size ;
    }

    return options;
  }

};

export { BaseController };
