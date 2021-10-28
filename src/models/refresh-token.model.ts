import { PrimaryKey, Entity, BaseEntity, Property, OneToOne } from '@mikro-orm/core'
import { v4 } from 'uuid'
import type { UserModel } from './user.model.js';

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

  @OneToOne({ entity: 'UserModel', inversedBy: 'refreshToken' })
  declare user: UserModel;
}
