export type Constructor<T> = new (...args: any[]) => T;
export type AnyFunction = (...args: any[]) => any | Promise<any>;
export type ObjectKey = string | number;
