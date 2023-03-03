import type { AnyEntity } from '@mikro-orm/core';
import { types, PrimaryKey, Entity, BaseEntity } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
  abstract: true
})
export abstract class BaseModel<T extends AnyEntity> extends BaseEntity<T, 'id'> {
  @PrimaryKey({
    type: types.string
  })
    id: string = v4();
}
