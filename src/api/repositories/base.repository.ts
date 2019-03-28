import { Repository, SelectQueryBuilder, Brackets } from "typeorm";
import * as SqlString from "sqlstring";
import { Request } from "express";
import * as Pluralize from 'pluralize';

/**
 * Base Repository class , inherited for all current repositories
 */
class BaseRepository<T> extends Repository<T> {

  /**
   * @description : Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/ (VERSION 1.0)
   */
  public JSONAPIRequest(query : any) : SelectQueryBuilder<T> {
    const currentTable = this.metadata.tableName;
    const splitAndFilter = (string : string) => string.split(',').map(e => e.trim()).filter(string => string != '');  //split parameters and filter empty strings
    let queryBuilder = this.createQueryBuilder(currentTable);

    /**
     * Check if include parameter exists
     * An endpoint MAY also support an include request parameter to allow the client to customize which related resources should be returned.
     * @ref : https://jsonapi.org/format/#fetching-includes
     */
    if (query.include)
    {
      let includes = splitAndFilter(query.include);

      includes.forEach( (include: string) => {

        let property : string,alias : string;

        if (include.indexOf(".") !== -1)
        {
          property = include;
          let test = include.split(".");
          alias = Pluralize.isPlural(test[test.length-1]) ? `${test[0]}.${Pluralize.singular(test[test.length-1])}` : test[test.length-1];
           //we need to singularize the table name for some reasons on the alias or deep includes will not work properly
        }else{
          property = `${currentTable}.${include}`;
          alias = include;
        }

        queryBuilder.leftJoinAndSelect(property,alias);
      });

    }


    /**
     * Check if fields parameter exists
     * A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
     * @ref : https://jsonapi.org/format/#fetching-sparse-fieldsets
     */
    if (query.fields)
    {
      let select = [];

      /**
       * Recursive function to populate select statement with fields array
       */
      let fillFields : Function = (props : object|string,parents : Array<String> = []) => {

        if (typeof props === "string") {
          if (!parents.length) parents = [currentTable];
          splitAndFilter(props)
            .forEach(elem => select.push(`${parents.join('.')}.${elem}`));
          }else{
            for (let index in props) {
                let property = props[index];
                let copy = parents.slice(); //slice makes a copy
                if (+index !== +index) copy.push(index); // fast way to check if string is number
                fillFields(property,copy);
            }
        }
      }

      fillFields(query.fields);

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

    if (query.filter)
    {
       let queryBrackets = new Brackets(qb => { //put everything into sub brackets to not interfere with more important search params
         for (let key in query.filter) {
           let filtered : Array<string> = splitAndFilter(query.filter[key]);
           filtered.forEach((e : string) => {
             let [ strategy , value ] = e.split(":");

             // TODO : fix params not working with TypeORM where
             if(strategy == "like") {
               qb.where(SqlString.format(`?? LIKE ?`,[key,value]));
             }
             if(strategy == "eq") {
               qb.where(SqlString.format(`?? = ?`,[key,value]));
             }
             if(strategy == "orlike") {
               qb.orWhere(SqlString.format(`?? LIKE ?`,[key,value]));
             }
             if(strategy == "oreq") {
               qb.orWhere(SqlString.format(`?? = ?`,[key,value]));
             }
           });
          }
        });
        queryBuilder.where(queryBrackets);
    }
    console.log(queryBuilder.getSql());
    return queryBuilder;
  }

  public jsonAPI_findOne(req : Request,id : any) : Promise<T>
  {
    return this.JSONAPIRequest(req.query)
      .where(`${this.metadata.tableName}.id = :id`,{id})
      .getOne()
  }

  public jsonAPI_find(req : Request) : Promise<Array<T>>
  {
    return this.JSONAPIRequest(req.query)
      .getMany()
  }

}

export { BaseRepository };
