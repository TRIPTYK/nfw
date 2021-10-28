import { PrimaryKey, Entity, BaseEntity, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity({
  tableName: 'refresh-token'
})
export class RefreshTokenModel extends BaseEntity<any, any> {
  @PrimaryKey()
  id: string = v4();

  @Property()
  declare token: string;

  @Property()
  declare expires: Date;
}
