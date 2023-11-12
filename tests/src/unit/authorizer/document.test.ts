import type { EntityData } from '@mikro-orm/core';
import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { Roles } from '../../../../src/features/users/enums/roles.enum.js';
import { DocumentResourceAuthorizerImpl } from '../../../../src/features/users/resources/documents/authorizer.js';
import { DocumentModel } from '../../../../src/features/users/models/document.model.js';
import { UserModel } from '../../../../src/features/users/models/user.model.js';

const adminUser = new UserModel();
adminUser.role = Roles.ADMIN;
adminUser.id = '1';

const normalUser = new UserModel();
normalUser.role = Roles.USER;
normalUser.id = '2';

const authorizer = new DocumentResourceAuthorizerImpl();
const anyDoc = new DocumentModel();

describe('Anonymous', () => {
  it('cannot read', () => {
    expect(authorizer.can(undefined, 'read', anyDoc)).toBe(false);
  });
  it('cannot create', () => {
    expect(authorizer.can(undefined, 'create', anyDoc)).toBe(false);
  });
  it('cannot update', () => {
    expect(authorizer.can(undefined, 'update', anyDoc)).toBe(false);
  });
  it('cannot delete', () => {
    expect(authorizer.can(undefined, 'delete', anyDoc)).toBe(false);
  });
})

describe('Admin', () => {
  it('can read', () => {
    expect(authorizer.can(adminUser, 'read', anyDoc)).toBe(true);
  });
  it('can create', () => {
    expect(authorizer.can(adminUser, 'create', anyDoc)).toBe(true);
  });
  it('can update', () => {
    expect(authorizer.can(adminUser, 'update', anyDoc)).toBe(true);
  });
  it('can delete', () => {
    expect(authorizer.can(adminUser, 'delete', anyDoc)).toBe(true);
  });
})

describe('User', () => {
  const userDoc: EntityData<DocumentModel> = {
    users: [{
      id: '1',
    }, {
      id: '2',
    }],
  };

  it('can read', () => {
    expect(authorizer.can(normalUser, 'read', anyDoc)).toBe(true);
  });
  it('can create', () => {
    expect(authorizer.can(normalUser, 'create', anyDoc)).toBe(true);
  });
  it('cannot update', () => {
    expect(authorizer.can(normalUser, 'update', anyDoc)).toBe(false);
  });
  it('can update if in users group', () => {
    expect(authorizer.can(normalUser, 'update', userDoc)).toBe(true);
  });
  it('cannot delete', () => {
    expect(authorizer.can(normalUser, 'delete', anyDoc)).toBe(false);
  });
  it('can delete if in users group', () => {
    expect(authorizer.can(normalUser, 'delete', userDoc)).toBe(true);
  });
})
