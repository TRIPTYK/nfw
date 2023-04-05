import 'reflect-metadata';
import { expect, test, describe, beforeEach } from 'vitest';
import { Roles } from '../../../../src/api/enums/roles.enum.js';
import { UserResourceValidator } from '../../../../src/api/resources/user/validator.js';
import type { UserResource } from '../../../../src/api/resources/user/resource.js';

describe('User Resource Validator', () => {
  let userResourceValidator: UserResourceValidator;
  const validUser: Partial<UserResource> = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    email: 'johndoe@example.com',
    role: Roles.ADMIN,
    documents: []
  };

  beforeEach(() => {
    userResourceValidator = new UserResourceValidator();
  });

  test('should validate a valid user resource', async () => {
    const result = await userResourceValidator.validate(validUser);
    expect(result.isValid).toBe(true);
    expect(result.result).toEqual(validUser);
  });

  test('should return errors for invalid user resource', async () => {
    const invalidUser: Partial<UserResource> = {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      role: '',
      documents: 'not an array'
    } as never;

    const result = await userResourceValidator.validate(invalidUser);
    expect(result.isValid).toBe(false);
    expect(result.errors?.length).toBe(6);
    expect(result.errors?.some(e => e.key === 'firstName')).toBe(true);
    expect(result.errors?.some(e => e.key === 'lastName')).toBe(true);
    expect(result.errors?.some(e => e.key === 'password')).toBe(true);
    expect(result.errors?.some(e => e.key === 'email')).toBe(true);
    expect(result.errors?.some(e => e.key === 'role')).toBe(true);
    expect(result.errors?.some(e => e.key === 'documents')).toBe(true);
  });
});
