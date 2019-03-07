import { Repository, SelectQueryBuilder } from "typeorm";
import * as SqlString from "sqlstring";


/**
 * Base Repository class , inherited for all current repositories
 */
class BaseRepository<T> extends Repository<T> {

  /**
   * @description : Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/ (VERSION 1.0)
   */
  public async JSONAPIRequest(query : any) : Promise<SelectQueryBuilder<T>> {
    const currentTable = this.metadata.tableName;
    const splitAndFilter = (string : string) => string.split(',').filter(string => string != '');  //split parameters and filter empty strings
    let queryBuilder = await this.createQueryBuilder(currentTable);

    /**
     * Check if include parameter exists
     * An endpoint MAY also support an include request parameter to allow the client to customize which related resources should be returned.
     * @ref : https://jsonapi.org/format/#fetching-includes
     */
    if (query.include)
    {
      let includes = splitAndFilter(query.include);
      includes.forEach( (include: string) => queryBuilder.leftJoinAndSelect(`${currentTable}.${include}`,include));
    }


    /**
     * Check if fields parameter exists
     * A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
     * @ref : https://jsonapi.org/format/#fetching-sparse-fieldsets
     */
    if (query.fields)
    {
      let select = [];

      for (let property in query.fields) {
        if ((query.include && query.include.includes(property)) || property == currentTable) {
          splitAndFilter(query.fields[property])
            .forEach(elem => select.push(`${property}.${elem}`));
        }
      }

      queryBuilder.select(select); // select parameters are escaped by default , no need to escape sql string
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
          queryBuilder.orderBy(SqlString.escapeId(field.substr(1)), "DESC"); //
        }else{
          queryBuilder.orderBy(SqlString.escapeId(field), "ASC");
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

      queryBuilder
        .skip( (number - 1) * size )
        .take( size );
    }

    return queryBuilder;
  }
}

export { BaseRepository };
