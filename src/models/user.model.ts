import { PrimaryKey, Entity, BaseEntity, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity({
  tableName: 'users'
})
export class UserModel extends BaseEntity<any, any> {
  @PrimaryKey()
  id: string = v4();

  @Property()
  declare firstName: string;

  @Property()
  declare lastName: string;

  @Property()
  declare password: string;
}
