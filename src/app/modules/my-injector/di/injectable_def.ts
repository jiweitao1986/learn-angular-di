import { Type } from './types';
import { getClosureSafeProperty } from './utils';


export interface InjectorType<T> extends Type<T> {
  ɵinj: never;
}

export interface ɵɵInjectableDef<T> {
  providedIn: InjectorType<any>|'root'|'platform'|'any'|null;
  token: unknown;
  factory: (t?: Type<any>) => T;
  value: T|undefined;
}


export function ɵɵdefineInjectable<T>(opts: {
  token: unknown,
  providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T,
}): never {
  return ({
    token: opts.token,
    providedIn: opts.providedIn as any || null,
    factory: opts.factory,
    value: undefined,
  } as ɵɵInjectableDef<T>) as never;
}


export const NG_PROV_DEF       = getClosureSafeProperty({ɵprov: getClosureSafeProperty});
export const NG_INJ_DEF        = getClosureSafeProperty({ɵinj: getClosureSafeProperty});
export const NG_INJECTABLE_DEF = getClosureSafeProperty({ngInjectableDef: getClosureSafeProperty});

export function getOwnDefinition<T>(type: any, def: ɵɵInjectableDef<T>): ɵɵInjectableDef<T>|null {
  return def && def.token === type ? def : null;
}

export function getInjectableDef<T>(type: any): ɵɵInjectableDef<T>|null {
  return getOwnDefinition(type, type[NG_PROV_DEF]) ||
      getOwnDefinition(type, type[NG_INJECTABLE_DEF]);
}
