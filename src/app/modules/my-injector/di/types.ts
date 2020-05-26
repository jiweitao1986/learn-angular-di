
export const Type = Function;

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export interface Type<T> extends Function {
   new (...args: any[]): T;
}

/**
 * @description
 *
 * Represents an abstract class `T`, if applied to a concrete class it would stop being
 * instantiatable.
 *
 * @publicApi
 */
export interface AbstractType<T> extends Function {
  prototype: T;
}

export enum InjectFlags {

  Default = 0b0000,

  Self = 0b0001,

  SkipSelf = 0b0010,

  Optional = 0b0100,
}


export const IDENT = function<T>(value: T): T {
  return value;
};

export const EMPTY = [] as any[];

export const CIRCULAR = IDENT;

export const MULTI_PROVIDER_FN = function(): any[] {
  return Array.prototype.slice.call(arguments);
};


export const enum OptionFlags {
  Optional = 1 << 0,
  CheckSelf = 1 << 1,
  CheckParent = 1 << 2,
  Default = CheckSelf | CheckParent
}

export const NEW_LINE = /\n/gm;

export const NO_NEW_LINE = 'ɵ';


/**
 * Record
 */
export interface Record {

  /**
   * fn
   */
  fn: Function;

  /**
   * useNew
   */
  useNew: boolean;

  /**
   * deps
   */
  deps: DependencyRecord[];

  /**
   * value
   */
  value: any;

}


/**
 * DependencyRecord
 */
export interface DependencyRecord {

  /**
   * token
   */
  token: any;

  /**
   * options
   */
  options: number;

}

