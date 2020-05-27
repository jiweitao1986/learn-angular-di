
export const Type = Function;


export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}


export interface Type<T> extends Function {
   new (...args: any[]): T;
}


export interface AbstractType<T> extends Function {
  prototype: T;
}


export enum InjectFlags {

  Default = 0b0000,

  Self = 0b0001,

  SkipSelf = 0b0010,

  Optional = 0b0100,
}


export const enum OptionFlags {
  Optional = 1 << 0,
  CheckSelf = 1 << 1,
  CheckParent = 1 << 2,
  Default = CheckSelf | CheckParent
}


export interface Record {

  fn: Function;

  useNew: boolean;

  deps: DependencyRecord[];

  value: any;

}


export interface DependencyRecord {

  token: any;

  options: number;
}


