import type { AnyEntity } from '@mikro-orm/core';
import { PrimaryKey, Entity, BaseEntity } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
  abstract: true,
})
export abstract class BaseModel<T extends AnyEntity> extends BaseEntity<T, 'id'> {
    @PrimaryKey()
      id: string = v4();
}
