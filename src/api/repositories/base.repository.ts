import { Repository, SelectQueryBuilder } from "typeorm";
import * as SqlString from "sqlstring";


/**
 * Base Repository class , inherited for all current repositories
 */
class BaseRepository<T> extends Repository<T> {
}

export { BaseRepository };
