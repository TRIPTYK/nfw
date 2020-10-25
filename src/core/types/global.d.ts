export type Type<T> = new (...args: any[]) => T
export type AnyFunction = (...args: any[]) => any | Promise<any>;