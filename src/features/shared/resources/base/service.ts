import type { Loaded, EntityData } from '@mikro-orm/core';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import type { Promisable } from 'type-fest';

export interface ResourceService<T> {
    getOne(id: string, query: JsonApiQuery): Promisable<Loaded<T, never> | null>,
    getOneOrFail(id: string, query: JsonApiQuery): Promisable<Loaded<T, never>>,
    getAll(query: JsonApiQuery): Promisable<[Loaded<T, never>[], number]>,
    create(body: EntityData<T>): Promisable<Loaded<T, never>>,
    update(id: string, body: EntityData<T>): Promisable<Loaded<T, never>>,
    delete(id: string): Promisable<void>,
  }
