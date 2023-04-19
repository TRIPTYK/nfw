import { types, PrimaryKey, Entity } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
  abstract: true
})
export abstract class BaseModel {
  @PrimaryKey({
    type: types.string
  })
    id: string = v4();
}
