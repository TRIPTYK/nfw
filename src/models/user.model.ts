import { PrimaryKey, Entity, BaseEntity, Property } from '@mikro-orm/core'
import { uuid } from 'uuidv4'

@Entity({
  tableName: 'users'
})
export class UserModel extends BaseEntity<any, any> {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  title!: string;
}
